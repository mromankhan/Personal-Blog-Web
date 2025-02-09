"use client";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type UseAuthStoreType = {
    user: User | null,
    userData: any | null,
    isAuthenticated: boolean,
    loading: boolean,
    login: (email: string, password: string, onSuccess?: () => void) => Promise<void>,
    logout: () => Promise<void>,
    fetchUserData: (uid: string) => Promise<void>
}

export const UseAuthStore = create<UseAuthStoreType>((set) => (
    {
        user: null,
        userData: null,
        isAuthenticated: false,
        loading: true,

        // login user func
        login: async (email, password, onSuccess) => {
            set({ loading: true });
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // console.log("user login sucessfull", user);
                set({ user, isAuthenticated: true });
                await UseAuthStore.getState().fetchUserData(user.uid);
                if (onSuccess) onSuccess();
            } catch (e) {
                // console.log(e);                
                toast.error("Invalid Email or Password");
            } finally {
                set({ loading: false });
            }
        },

        //logout func
        logout: async () => {
            await signOut(auth);
            set({ user: null, userData: null, isAuthenticated: false });
        },

        //user data fetchiong function
        fetchUserData: async (uid) => {
            if (!uid) {
                // console.error("No UID provided!");
                return
            }
            try {
                const userRef = doc(db, "users", uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    // console.log("User Data:", data);
                    set({ userData: data });
                } 
                // else { 
                //     console.error("No such document!") 
                // }
            } catch (e) { 
                // console.log(`userDataFetching function error is: ${e}`) 
            }
        },


    }));

onAuthStateChanged(auth, async (user) => {
    const authStore = UseAuthStore.getState();
    if (user) {
        authStore.fetchUserData(user.uid);
        authStore.isAuthenticated = true;
        authStore.user = user;
    } else {
        authStore.isAuthenticated = false;
        authStore.user = null;
        authStore.userData = null;
    }
    authStore.loading = false;

})
















