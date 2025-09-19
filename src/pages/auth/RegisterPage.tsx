import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Input } from '@heroui/react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import { Link, Links, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterSchema } from '../../schemas/AuthSchema';
import { useRegistration } from '../../context/RegistrationContext';


const LoginPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { isLoading } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });
    const { setPendingEmail } = useRegistration();

    useEffect(() => {
        if (user && token) {
            if (user.roles?.name === "admin") navigate("/dashboard", { replace: true });
            else navigate("/", { replace: true });
        }
    }, [user, token, navigate]);

    const onSubmit = async (values: RegisterSchema) => {
        try {
            const res = await authService.register(values);
            if(res.status) {
                setPendingEmail(values.email);             // simpan di state management
                navigate("/verify", { replace: true });
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
                <h1 className="text-2xl font-semibold">Buat Akun</h1>
                <p className="text-sm text-foreground-500">
                    Daftar akun Anda untuk memulai aplikasi
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
                    label="Username"
                    type="text"
                    variant="bordered"
                    isInvalid={!!errors.username}
                    errorMessage={errors.username?.message}
                    {...register("username")}
                />

                <Input
                    label="Nama"
                    type="text"
                    variant="bordered"
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    {...register("name")}
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

            </CardBody>

            <CardFooter className="flex flex-col gap-3">
                <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    isLoading={isSubmitting}
                >
                Daftar
                </Button>

                <p className="text-center text-sm text-foreground-500">
                    Sudah punya akun?{" "}
                    <Link to="/login" className='text-primary'>
                        Masuk
                    </Link>
                </p>
            </CardFooter>
            </form>
        </Card>
    </div>
  )
}

export default LoginPage