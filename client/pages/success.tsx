import { useSession } from "next-auth/client";

export default function success() {
  const [session] = useSession();

  console.log({ session });

  return (
    <div className="flex h-screen justify-center items-center w-screen flex-col">
      <h1 className="text-4xl font-bold text-gray-700">Success!</h1>
      <p className="mt-2 text-gray-400">You can close this tab now...</p>
    </div>
  );
}
