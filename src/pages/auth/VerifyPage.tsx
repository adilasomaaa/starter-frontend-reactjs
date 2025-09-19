// src/pages/auth/VerifyPage.tsx
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  InputOtp,
} from "@heroui/react";
import { useRegistration } from "../../context/RegistrationContext";
import { verifySchema, type VerifySchema } from "../../schemas/AuthSchema";
import { authService } from "../../services/AuthService";
import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const { pendingEmail, clear } = useRegistration();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: pendingEmail ?? "" },
  });

  const skipGuardRef = useRef(false);

  
  const onSubmit = async (values: VerifySchema) => {
    try {
      // pastikan email diambil dari state jika user mengosongkan/mengubah
      const payload = {
        code: values.code,
        email: pendingEmail ?? values.email,
      };
      const res = await authService.verifyCode(payload); // implement di service kamu
      console.log(res);
      
      if (res.status) {
            skipGuardRef.current = true;
            navigate("/login", { replace: true });
            setTimeout(() => clear(), 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resendCode = async () => {
    try {
      const payload = {
        email: pendingEmail ?? "",
      };
      const res = await authService.resendCode(payload); // implement di service kamu
      if (res.status) {
        setCooldown(30);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!pendingEmail && !skipGuardRef.current) {
    return <Navigate to="/register" replace />;
  }


  return (
    <div className="min-h-dvh grid place-items-center">
      <Card className="w-full md:w-[400px] sm:w-full p-4  shadow-none">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Verifikasi Akun</h1>
          <p className="text-sm text-foreground-500 text-justify">
            Masukkan kode verifikasi yang telah dikirim melalui email{" "}
            <b>{pendingEmail}</b>. Kode verifikasi akan kadaluwarsa setelah 10
            menit.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="flex flex-col gap-4">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <div className="flex justify-center">
                  <InputOtp
                    className="justify-center"
                    length={6}
                    value={field.value}
                    size="lg"
                    onValueChange={(v) => field.onChange(v)}
                    // styling/props tambahan kalau perlu:
                    // variant="bordered"
                    // color={errors.code ? "danger" : "default"}
                  />
                  {errors.code && (
                    <span className="text-xs text-danger">{errors.code.message}</span>
                  )}
                </div>
              )}
            />

            <button
              type="button"
              onClick={() => void resendCode()}
              disabled={cooldown > 0}
              className="text-sm text-foreground-500 text-right disabled:opacity-60 cursor-pointer"
            >
              {cooldown > 0 ? `Kirim Ulang Kode (${cooldown}s)` : "Kirim Ulang Kode"}
            </button>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Verifikasi
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
