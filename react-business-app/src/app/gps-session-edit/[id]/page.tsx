'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GpsSessionService } from '@/service/GpsSessionService';
import type { IGpsSession } from '@/domain/IGpsSessionResponse';
import type { IResultObject } from '@/types/IResultObject';

export default function GpsSessionEditPage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = params.id as string;

    const gpsSessionService = new GpsSessionService();

    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        recordedAt: '',
        paceMin: 0,
        paceMax: 0,
        gpsSessionTypeId: ''
    });

    const [errors, setErrors] = useState<IResultObject<IGpsSession>["errors"]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await gpsSessionService.getByIdAsync(sessionId);
                if (result.data) {
                    setForm({
                        id: sessionId,
                        name: result.data.name,
                        description: result.data.description,
                        recordedAt: result.data.recordedAt,
                        paceMin: result.data.paceMin,
                        paceMax: result.data.paceMax,
                        gpsSessionTypeId: ''
                    });
                }
                setErrors(result.errors);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (sessionId) {
            fetchData();
        }
    }, [sessionId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await gpsSessionService.updateAsync(sessionId, form);
            setErrors(result.errors);
            console.log('Saving session:', form);
            router.push('/gps-session');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const cancel = () => {
        router.push('/gps-session');
    };

    return (
        <div className="container mt-4">
            {errors && typeof errors === 'object' && (
                <div className="alert alert-warning" role="alert">
                    <ul className="mb-0">
                        {Object.entries(errors).map(([key, val]) => (
                            <li key={key}>{String(val)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {typeof errors === 'string' && (
                <div className="alert alert-warning" role="alert">
                    {errors}
                </div>
            )}

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Edit Session</h2>
                <form onSubmit={handleSave}>
                    {[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Description', name: 'description', type: 'textarea' },
                        { label: 'Recorded At', name: 'recordedAt', type: 'text' },
                        { label: 'Pace Min', name: 'paceMin', type: 'number' },
                        { label: 'Pace Max', name: 'paceMax', type: 'number' },
                        { label: 'Session Type', name: 'gpsSessionTypeId', type: 'text' }
                    ].map(({ label, name, type }) => (
                        <div className="row mb-3" key={name}>
                            <label className="col-sm-3 col-form-label fw-bold">{label}</label>
                            <div className="col-sm-9">
                                {type === 'textarea' ? (
                                    <textarea
                                        name={name}
                                        value={(form as any)[name]}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows={3}
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={(form as any)[name]}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="row">
                        <div className="offset-sm-3 col-sm-9 d-flex justify-content-end">
                            <button type="button" onClick={cancel} className="btn btn-outline-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary ms-2">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
