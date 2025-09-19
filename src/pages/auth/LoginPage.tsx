import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Input } from '@heroui/react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from '../../schemas/AuthSchema';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


const LoginPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { user, token, login } = useAuth();
    const navigate = useNavigate();
    const { isLoading } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (user && token) {
            if (user.roles?.name === "admin") navigate("/dashboard", { replace: true });
            else navigate("/", { replace: true });
        }
    }, [user, token, navigate]);

    const onSubmit = async (values: LoginSchema) => {
        try {
            const res = await authService.login(values);
            if (res.token) {
                login(res.token); // cukup simpan token
            }
        } catch (e) {
            console.error(e);
            // tampilkan toast error
        }
    };
  return (
    <div className="min-h-dvh grid place-items-center bg-background">
        <Card className="w-full md:w-[400px] sm:w-full p-4 shadow-none">
            <CardHeader className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Masuk</h1>
            <p className="text-sm text-foreground-500">
                Silakan masuk untuk melanjutkan.
            </p>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Kata Sandi"
                    endContent={
                        <button
                        aria-label="toggle password visibility"
                        className="focus:outline-solid outline-transparent"
                        type="button"
                        onClick={toggleVisibility}
                        >
                        {isVisible ? (
                            <EyeOff className="text-2xl mb-1 text-default-400 pointer-events-none" />
                        ) : (
                            <Eye className="text-2xl mb-1 text-default-400 pointer-events-none" />
                        )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    {...register("password")}
                />

                <div className="flex items-center justify-between">
                <Checkbox {...register("remember")}>Ingat saya</Checkbox>
                <Link to="/forgot-password" className='text-sm text-primary'>
                    Lupa kata sandi?
                </Link>
                </div>
            </CardBody>

            <CardFooter className="flex flex-col gap-3">
                <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    isLoading={isSubmitting}
                >
                Masuk
                </Button>

                <p className="text-center text-sm text-foreground-500">
                Belum punya akun?{" "}
                <Link to="/register" className='text-primary'>
                    Daftar
                </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
    </div>
  )
}

export default LoginPage