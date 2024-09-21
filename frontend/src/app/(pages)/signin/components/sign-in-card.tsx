"use client";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { twMerge } from "tailwind-merge";
import { useSignIn } from "@/hooks/use-signin";
import { useW3SClient } from "@/hooks/use-w3s-client";
import { useUserToken } from "@/hooks/use-user-token";
import { useRouter } from "next/navigation";

const formSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Email required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password required"),
});

type FormType = yup.InferType<typeof formSchema>;

const SigninCard = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormType>({
    resolver: yupResolver(formSchema)
  });
  const onSignIn = useSignIn();
  const client = useW3SClient();
  const [, setUserToken] = useUserToken();
  const router = useRouter();

  const onSubmit = async (data: FormType) => {
    if (!client) return;

    try {
      const res = await onSignIn(data);

      if (res.result !== "success") {
        throw new Error("Signin failed");
      }

      setUserToken((data) => {
        return {
          ...data,
          userId: res.data.userId,
          userToken: res.data.userToken,
          encryptionKey: res.data.encryptionKey
        };
      });

      if (res.data.challengeId) {
        client.execute(res.data.challengeId, (err, res) => {
          console.log(err, res);
          if (err) {
            console.error(err);
            return;
          }

          router.push("/dashboard");
        });
      } else {
        router.push("/dashboard");

      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="card shadow-xl bg-white" >
      <div className="card-body" >
        <h2 className="card-title uppercase font-bold mb-5 text-black" >Register/Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1">
            <div className="relative mb-6">
              <label className={twMerge("input input-bordered flex items-center gap-2  text-black", errors.email && "input-error")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 fill-primary">
                  <path
                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path
                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Email"
                  {...register('email')}
                />
              </label>
              <p className="text-red-600 absolute -bottom-5 text-xs">{errors.email?.message}</p>
            </div>
            <div className="relative mb-6">
              <label className={twMerge("input input-bordered flex items-center gap-2 mb-4 text-black", errors.password && "input-error")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 fill-primary">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input type="password" placeholder="Password" className="grow" {...register('password')} />
              </label>
              <p className="text-red-600 absolute -bottom-5 text-xs">{errors.password?.message}</p>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Register/Login</button>
        </form>
      </div>
    </div>
  );
}

export default SigninCard;