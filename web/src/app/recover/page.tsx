"use client";

import { postUsersRecover } from "@/api/sdk.gen";
import { CenteredCard } from "@/components/custom/CenteredCard";
import { CustomFormField } from "@/components/custom/CustomFormField";
import { LoadingButton } from "@/components/custom/LoadingButton";
import { VariablesContext } from "@/components/custom/Variables";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RecoverPage = () => {
  const { projectName, emailPlaceholder } = useContext(VariablesContext);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    email: z
      .string()
      .min(1, "Veuillez renseigner votre adresse email")
      .email("Veuillez renseigner une adresse email valide"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await postUsersRecover({
        body: {
          email: values.email,
        },
      });
      setIsLoading(false);
      const status = response.response?.status;
      if (status !== undefined && status < 300) {
        router.push("/recover/success");
        return;
      }
      const errorDetail = response.error as
        { detail: Array<{ msg: string }> } | { detail: string } | undefined;
      toast({
        title: "Erreur",
        description: Array.isArray(errorDetail?.detail)
          ? errorDetail.detail[0]?.msg
          : errorDetail?.detail,
        variant: "destructive",
      });
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: `${e}`,
        variant: "destructive",
      });
    }
  }

  return (
    <CenteredCard
      title={`Réinitialiser le mot de passe ${projectName}`}
      description={"Entrez votre email pour commencer"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <CustomFormField
              form={form}
              name="email"
              label="Email"
              render={(field) => (
                <Input
                  type="email"
                  autoFocus
                  placeholder={emailPlaceholder}
                  {...field}
                />
              )}
            />
            <LoadingButton
              type="submit"
              className="mt-2 w-full"
              label={"Recevoir le code de réinitialisation"}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
    </CenteredCard>
  );
};

export default RecoverPage;
