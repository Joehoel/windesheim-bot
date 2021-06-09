import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/client";
import { useEffect } from "react";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  opleiding: string;
};

const schema = yup.object().shape({
  firstname: yup.string().required().trim(),
  lastname: yup.string().required().trim(),
  email: yup.string().required().trim(),
  opleiding: yup.string().required(),
});

const IndexPage = ({ csrfToken }) => {
  const [session, loading] = useSession();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async data => {
    await signIn("email", { email: data.email });
    await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, verified: false }),
    });
  });

  useEffect(() => {
    if (session) {
      (async () => {
        await fetch("/api/user", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email, verified: true }),
        });
      })();
    }
  }, [session]);

  return (
    <Layout title="Windesheim Discord">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <form onSubmit={onSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstname">
              Voornaam
            </label>
            <input
              className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
              type="text"
              name="firstname"
              id="firstname"
              autoComplete="given-name"
              {...register("firstname")}
            />
            <span>{errors.firstname?.message}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastname">
              Achternaam
            </label>
            <input
              className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
              type="text"
              name="lastname"
              id="lastname"
              autoComplete="family-name"
              {...register("lastname")}
            />
            <span>{errors.lastname?.message}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              {...register("email")}
            />
            <span>{errors.email?.message}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="opleiding">
              Opleiding
            </label>
            <select
              className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
              name="opleiding"
              id="opleiding"
              defaultValue="hbo-ict"
              {...register("opleiding")}
            >
              <option value="hbo-ict">HBO-ICT</option>
            </select>
            <span>{errors.opleiding?.message}</span>
          </div>
          <div>
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default IndexPage;
