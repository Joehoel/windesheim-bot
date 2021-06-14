import { yupResolver } from "@hookform/resolvers/yup";
import { getCsrfToken, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Layout from "../components/Layout";

type FormData = {
  firstname: string;
  lastname: string;
  opleiding: string;
};

type EmailData = {
  email: string;
};

const schema = yup.object().shape({
  firstname: yup.string().required().trim(),
  lastname: yup.string().required().trim(),
  opleiding: yup.string().required(),
});

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .matches(/windesheim.nl$/gi)
    .required()
    .trim(),
});

const IndexPage = ({ csrfToken }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const {
    register: registerEmail,
    formState: { errors: emailErrors },
    getValues,
  } = useForm<EmailData>({
    mode: "onChange",
    resolver: yupResolver(emailSchema),
  });
  const onSubmit = handleSubmit(async data => {
    // const auth = await fetch(`/api/auth?code=${code}`).then(res => res.json());
    // console.log(auth);
    const state = JSON.stringify({ ...data, email: session.user.email });
    const params: BodyInit = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.CALLBACK_URL,
      response_type: "code",
      scope: "identify guilds guilds.join",
      state,
    });
    router.push(`https://discord.com/api/oauth2/authorize?${params}`);
  });
  useEffect(() => {
    if (router.query.callbackUrl) {
      toast.success("✉ Email sent!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);

  if (loading) return "Loading...";

  if (!session)
    return (
      <Layout title="Verifieer email">
        <section className="flex justify-center items-center h-screen">
          <form action="/api/auth/signin/email" method="POST" className="w-2/3 space-y-2">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <h1 className="font-bold text-3xl text-gray-700 mb-4">Verifieer email</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
                type="email"
                name="email"
                id="email"
                required={true}
                autoComplete="email"
                placeholder="s1234567@student.windesheim.nl"
                {...registerEmail("email")}
              />
              <span className="font-semibold text-sm text-red-600">
                {emailErrors.email && "Email domain must contain 'windesheim.nl'"}
              </span>
            </div>
            <div className="flex">
              <button
                className="disabled:opacity-50 disabled:cursor-not-allowed ml-auto justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                type="submit"
                disabled={emailErrors.email || getValues().email === "" ? true : false}
              >
                Verifieer
              </button>
            </div>
          </form>
        </section>
      </Layout>
    );

  return (
    <Layout title="Windesheim Discord">
      {/* <button onClick={() => authenticate()}>Authenticate</button> */}
      <section className="flex justify-center items-center h-screen">
        <form onSubmit={onSubmit} className="w-2/3 space-y-2">
          <h1 className="font-bold text-3xl text-gray-700 mb-4">Register</h1>
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
              placeholder="Jan"
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
              placeholder="de Boer"
              {...register("lastname")}
            />
            <span>{errors.lastname?.message}</span>
          </div>
          {/* <div>
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
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="opleiding">
              Opleiding
            </label>
            <select
              className="shadow-sm focus:ring-yellow-400 focus:border-yellow-400 mt-1 block w-full sm:text-sm rounded border-gray-300"
              name="opleiding"
              id="opleiding"
              defaultValue="852101226963402762"
              {...register("opleiding")}
            >
              <option value="852101226963402762">Economie & Recht</option>
              <option value="852101227428708353">Gezondheid & Welzijn</option>
              <option value="852101228459458580">Journalistiek & Communicatie</option>
              <option value="852909042309136424">Bewegen & Sport</option>
              <option value="852101229232521216">Leiderschap</option>
              <option value="852101229563346955">Logistiek</option>
              <option value="852101230561067029">Onderwijs</option>
              <option value="852101231799435315">Techniek & ICT</option>
              <option value="852101232477863946">Theologie & Levensbeschouwing</option>
            </select>
            <span>{errors.opleiding?.message}</span>
          </div>
          <div className="flex w-full">
            <button
              className="ml-auto justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              type="submit"
            >
              Indienen
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

export default IndexPage;
