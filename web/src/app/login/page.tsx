"use client";

import { CenteredCard } from "@/components/custom/CenteredCard";
import { LoadingButton } from "@/components/custom/LoadingButton";
import { LoginCustomFormField } from "@/components/custom/LoginCustomField";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { SuspenseHiddenField } from "@/components/custom/SuspenseHiddenField";
import { VariablesContext } from "@/components/custom/Variables";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Login = () => {
  const { projectName, entityName, emailPlaceholder } =
    useContext(VariablesContext);

  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    password: z.string().min(1, "Veuillez renseigner un mot de passe"),
    email: z.string().min(1, "Veuillez renseigner votre adresse email"),
    response_type: z.string().optional(),
    redirect_uri: z.string().optional(),
    client_id: z.string(),
    scope: z.string().optional(),
    state: z.string().optional(),
    nonce: z.string().optional(),
    code_challenge: z.string().optional(),
    code_challenge_method: z.string().optional(),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });

  /**
   * Add the authentication JWT to the OIDC authorization form
   * and submit it using a native browser form submission.
   */
  const submitAuthorization = (authToken: string) => {
    const htmlForm = formRef.current;

    if (!htmlForm) {
      throw new Error("Impossible de soumettre le formulaire");
    }

    // Remove an existing JWT if there is one.
    htmlForm
      .querySelectorAll('input[name="auth_access_token"]')
      .forEach((input) => input.remove());

    const authJwtInput = document.createElement("input");
    authJwtInput.type = "hidden";
    authJwtInput.name = "auth_access_token";
    authJwtInput.value = authToken;

    htmlForm.appendChild(authJwtInput);

    // Native form submission is intentional:
    // the authorization endpoint can perform the OIDC redirect.
    htmlForm.submit();
  };

  /**
   * Login using email/password authentication
   *
   * Call /auth/simple_token to an access token JWT with scope *auth*
   * This auth token will be used to authenticate the oauth/oidc authorize form submission
   *
   *
   * email/password -> /auth/simple_token -> auth token -> authorization-flow/authorize-validation
   *
   */
  const onSubmitEmailPassword = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_OVERRIDE_HYPERION_URL || window.location.origin;

      const body = new URLSearchParams({
        username: values.email,
        password: values.password,
      });

      const response = await fetch(`${baseUrl}/auth/simple_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.detail == "Incorrect login or password") {
          form.setError("email", {
            message: "Combinaison email / mot de passe invalide",
          });
          form.setError("password", {
            message: "Combinaison email / mot de passe invalide",
          });
          setIsLoading(false);
          return;
        }
        throw new Error(
          JSON.stringify(errorData.detail || "Failed to authenticate"),
        );
      }

      const tokenData = await response.json();
      const authToken = tokenData.access_token;
      if (!authToken || typeof authToken !== "string") {
        throw new Error("auth_jwt is missing");
      }

      submitAuthorization(authToken);
    } catch (error) {
      console.log(error);

      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });

      setIsLoading(false);
    }
  };

  return (
    <CenteredCard
      title={projectName}
      description={`Portail de connexion pour les services proposé par ${entityName}`}
    >
      <Form {...form}>
        {/* We can't use redirection since it will trigger CORS error, thus we are using the form */}
        <form
          ref={formRef}
          method="POST"
          action={`${
            process.env.NEXT_PUBLIC_OVERRIDE_HYPERION_URL ||
            (typeof window !== "undefined" ? window.location.origin : "")
          }/auth/authorization-flow/authorize-validation`}
          onSubmit={
            // react-hooks/refs false positive: handleSubmit returns a new
            // function; formRef.current is only read when the submit event
            // actually fires, never during render.
            // eslint-disable-next-line react-hooks/refs
            form.handleSubmit(onSubmitEmailPassword)
          }
        >
          <div className="grid gap-4">
            <LoginCustomFormField
              form={form}
              name="email"
              label="Email"
              render={(field) => (
                <Input
                  type="email"
                  autoFocus
                  placeholder={emailPlaceholder}
                  required
                  {...field}
                />
              )}
            />

            <LoginCustomFormField
              form={form}
              name="password"
              label="Mot de passe"
              render={(field) => <PasswordInput required {...field} />}
              displayError
            />

            <SuspenseHiddenField
              form={form}
              name="response_type"
              queryParam="response_type"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="redirect_uri"
              queryParam="redirect_uri"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="client_id"
              queryParam="client_id"
            />

            <SuspenseHiddenField
              form={form}
              name="scope"
              queryParam="scope"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="state"
              queryParam="state"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="nonce"
              queryParam="nonce"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="code_challenge"
              queryParam="code_challenge"
              optional
            />

            <SuspenseHiddenField
              form={form}
              name="code_challenge_method"
              queryParam="code_challenge_method"
              optional
            />

            <LoadingButton
              type="submit"
              className="mt-2 w-full"
              label="Se connecter"
              isLoading={isLoading}
            />

            <div className="flex flex-row justify-between">
              <Link href="/register" target="_blank" rel="noopener noreferrer">
                Créer un compte
              </Link>

              <Link href="/recover" target="_blank" rel="noopener noreferrer">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </CenteredCard>
  );
};

export default Login;
