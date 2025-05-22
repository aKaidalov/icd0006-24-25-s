"use client";

import Link from "next/link";
import {useState} from "react";
import {useBaseContext} from "@/context/BaseContext";

export default function Header() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const {isAuthenticated} = useBaseContext();

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link className="navbar-brand" href="/">SportMap</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarSupportedContent"
                        aria-expanded={!isCollapsed}
                        aria-label="Toggle navigation"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className={`navbar-collapse collapse d-sm-inline-flex justify-content-between ${!isCollapsed ? "show" : ""}`}>
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link className="nav-link text-dark" href="/gps-session">GpsSessions</Link>
                            </li>
                        </ul>
                        {!isAuthenticated ? (
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" href="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" href="/login">Login</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" href="#">Logout</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
