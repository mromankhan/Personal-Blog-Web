/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { auth, db } from "@/firebase/firebaseConfig";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    setPersistence, 
    browserLocalPersistence, 
    User 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define UserData type
type UserData = {
    name?: string;
    email?: string;
    role?: string;
    [key: string]: any;
};

// Update store type
type UseAuthStoreType = {
    user: User | null;
    userData: UserData | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
    fetchUserData: (uid: string) => Promise<void>;
};

// Zustand store
export const UseAuthStore = create<UseAuthStoreType>((set) => ({
    user: null,
    userData: null,
    isAuthenticated: false,
    loading: false,

    // Login function
    login: async (email, password, onSuccess) => {
        set({ loading: true });
        try {
            // Set persistence before login
            await setPersistence(auth, browserLocalPersistence);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user in Zustand
            set({ user, isAuthenticated: true });

            // Fetch user data
            await UseAuthStore.getState().fetchUserData(user.uid);

            if (onSuccess) onSuccess();
        } catch (e) {
            void e;
            // console.log(e); for dev
            toast.error("Invalid Email or Password", {theme: "colored"});
        } finally {
            set({ loading: false });
        }
    },

    // Logout function
    logout: async () => {
        await signOut(auth);
        set({ user: null, userData: null, isAuthenticated: false });
    },

    // Fetch user data function
    fetchUserData: async (uid) => {
        if (!uid) return;
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const data = userDoc.data() as UserData;
                set({ userData: data });
            }
        } catch (e) {
            void e;
            // console.log(`userDataFetching function error: ${e}`); for dev
        }
    },
}));

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await UseAuthStore.getState().fetchUserData(user.uid);
        UseAuthStore.setState({
            user,
            isAuthenticated: true,
            loading: false,
        });
    } else {
        UseAuthStore.setState({
            user: null,
            userData: null,
            isAuthenticated: false,
            loading: false,
        });
    }
});

