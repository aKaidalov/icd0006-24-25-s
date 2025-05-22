"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {useBaseContext} from "@/context/BaseContext";
import { IdentityService } from "@/service/IdentityService";

export default function LoginPage() {
    const router = useRouter();
    const { setJwt } = useBaseContext();
    const [email, setEmail] = useState("sasha@test.ee");
    const [password, setPassword] = useState("123456Az@");
    const [error, setError] = useState<string | null>(null);

    const doLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await IdentityService.login(email, password);

        if (response.data) {
            setJwt(
                response.data.token,
                response.data.firstName,
                response.data.lastName
            )
            await router.push('/');
        } else {
            setError(response.errors?.[0] || "Login failed.")
        }
    };

    return (
        <main role="main" className="pb-3">
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <h1>Log in</h1>

                    {error && <div className="alert alert-warning" role="alert">{error}</div>}

                    <section>
                        <form onSubmit={doLogin} id="account" method="post" noValidate>
                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    id="Input_Email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="Input_Email">Email</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    id="Input_Password"
                                    type="password"
                                    placeholder="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="Input_Password">Password</label>
                            </div>

                            <div>
                                <button id="login-submit" type="submit" className="w-100 btn btn-lg btn-primary">
                                    Log in
                                </button>
                            </div>

                            <div className="mt-3">
                                <p><Link href="/forgot-password">Forgot your password?</Link></p>
                                <p><Link href="/register">Register as a new user</Link></p>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
