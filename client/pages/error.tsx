import { useRouter } from "next/router";
import Link from "next/link";

const error = () => {
  const router = useRouter();

  if (router.query.error === "EmailSignin") {
    return (
      <section className="h-screen w-screen flex flex-col justify-center items-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-700">Er is iets fout gegaan</h1>
        <p className="text-gray-400">Er is iets fout gegaan met het sturen van de verificatie email</p>
        <button
          className="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          onClick={() => router.back()}
        >
          Terug
        </button>
      </section>
    );
  }

  return (
    <section className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-700 mb-4">Er is iets fout gegaan</h1>
      <button
        className="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        onClick={() => router.back()}
      >
        Terug
      </button>
    </section>
  );
};

export default error;
