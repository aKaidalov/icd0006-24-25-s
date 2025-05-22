"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface IBaseContext {
    jwt: string | null;
    firstName: string | null;
    lastName: string | null;
    setJwt: (token: string, firstName: string, lastName: string) => void;
    clearJwt: () => void;
    isAuthenticated: boolean;
}

export const useBaseContext = () => {
    const context = useContext(BaseContext);
    if (!context) {
        throw new Error("useMainContext must be used within a MainProvider");
    }
    return context;
}

export const BaseContext = createContext<IBaseContext | undefined>(undefined);

export const BaseProvider = ({ children }: { children: ReactNode }) => {
    const [jwt, setJwtValue] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setJwt = (token: string, first: string, last: string) => {
        setJwtValue(token);
        setFirstName(first);
        setLastName(last);
        setIsAuthenticated(true);
    };

    const clearJwt = () => {
        setJwtValue(null);
        setFirstName(null);
        setLastName(null);
        setIsAuthenticated(false);
    };

    return (
        <BaseContext.Provider
            value={{
                jwt,
                firstName,
                lastName,
                setJwt,
                clearJwt,
                isAuthenticated,
            }}
        >
            {children}
        </BaseContext.Provider>
    );
};
