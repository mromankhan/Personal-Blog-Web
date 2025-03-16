import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Loader className="size-20 animate-spin" />
    </div>
  );
};

export default loading;