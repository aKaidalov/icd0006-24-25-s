"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useBaseContext } from "@/context/BaseContext";
import { IdentityService } from "@/service/IdentityService";

export default function RegisterPage() {
    const router = useRouter();
    const { setJwt } = useBaseContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await IdentityService.register(email, password, firstName, lastName);

        if (response?.data) {
            setJwt(response.data.token, response.data.firstName, response.data.lastName);
            router.push("/");
        } else {
            setError("Register failed."); //response?.errors?.[0] ||
        }
    };

    return (
        <main role="main" className="pb-3">
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <h1>Register</h1>

                    {error && <div className="alert alert-warning" role="alert">{error}</div>}

                    <section>
                        <form onSubmit={handleSubmit} id="account" noValidate>
                            <div className="form-floating mb-3">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    id="Input_Email"
                                    placeholder="name@example.com"
                                    type="email"
                                    required
                                />
                                <label htmlFor="Input_Email">Email</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    id="Input_Password"
                                    placeholder="password"
                                    type="password"
                                    required
                                />
                                <label htmlFor="Input_Password">Password</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="form-control"
                                    id="Input_FirstName"
                                    placeholder="First Name"
                                    type="text"
                                    required
                                />
                                <label htmlFor="Input_FirstName">First Name</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="form-control"
                                    id="Input_LastName"
                                    placeholder="Last Name"
                                    type="text"
                                    required
                                />
                                <label htmlFor="Input_LastName">Last Name</label>
                            </div>

                            <div>
                                <button type="submit" className="w-100 btn btn-lg btn-primary">
                                    Register
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
