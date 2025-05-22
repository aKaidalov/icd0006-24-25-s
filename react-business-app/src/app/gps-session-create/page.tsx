'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IGpsSessionCreateRequest } from '@/domain/IGpsSessionRequest';
import type { IResultObject } from '@/types/IResultObject';
import { GpsSessionService } from '@/service/GpsSessionService';
import {IGpsSessionCreateResponse} from "@/domain/IGpsSessionResponse";

export default function CreateGpsSessionPage() {
    const router = useRouter();
    const gpsSessionService = new GpsSessionService();

    const [requestIsOngoing, setRequestIsOngoing] = useState(false);
    const [gpsSessionData, setGpsSessionData] = useState<IResultObject<IGpsSessionCreateResponse>>({});
    const [gpsSession, setGpsSession] = useState<IGpsSessionCreateRequest>({
        name: '',
        description: '',
        gpsSessionTypeId: '',
        recordedAt: '',
        paceMin: 60,
        paceMax: 61,
    });

    const handleChange = (field: keyof IGpsSessionCreateRequest, value: string | number) => {
        setGpsSession(prev => ({ ...prev, [field]: value }));
    };

    const cancel = () => {
        router.push('/gps-session');
    };

    const postGpsSession = async () => {
        setRequestIsOngoing(true);
        console.log(gpsSession)
        try {
            const result = await gpsSessionService.addAsync(gpsSession);
            setGpsSessionData(result);

            if (!result.errors) {
                router.push('/gps-session');
            }
        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setRequestIsOngoing(false);
        }
    };

    const doCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await postGpsSession();
    };

    return (
        <div className="container mt-4">
            {gpsSessionData.errors && typeof gpsSessionData.errors === 'object' && (
                <div className="alert alert-warning" role="alert">
                    <ul className="mb-0">
                        {Object.entries(gpsSessionData.errors).map(([field, message]) => (
                            <li key={field}>{String(message)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {gpsSessionData.errors && typeof gpsSessionData.errors === 'string' && (
                <div className="alert alert-warning" role="alert">
                    {gpsSessionData.errors}
                </div>
            )}
            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Create New GpsSession</h2>

                <form onSubmit={doCreate}>
                    <div className="row mb-3">
                        <label htmlFor="Input_Name" className="col-sm-3 col-form-label fw-bold">Name</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_Name"
                                type="text"
                                className="form-control"
                                value={gpsSession.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label htmlFor="Input_Description" className="col-sm-3 col-form-label fw-bold">Description</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_Description"
                                type="text"
                                className="form-control"
                                value={gpsSession.description}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label htmlFor="Input_GpsSessionTypeId" className="col-sm-3 col-form-label fw-bold">Session Type</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_GpsSessionTypeId"
                                type="text"
                                className="form-control"
                                value={gpsSession.gpsSessionTypeId}
                                onChange={e => handleChange('gpsSessionTypeId', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label htmlFor="Input_RecordedAt" className="col-sm-3 col-form-label fw-bold">Recorded At</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_RecordedAt"
                                type="datetime-local"
                                className="form-control"
                                value={gpsSession.recordedAt}
                                onChange={e => handleChange('recordedAt', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label htmlFor="Input_PaceMin" className="col-sm-3 col-form-label fw-bold">Pace Min</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_PaceMin"
                                type="number"
                                className="form-control"
                                value={gpsSession.paceMin}
                                onChange={e => handleChange('paceMin', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <label htmlFor="Input_PaceMax" className="col-sm-3 col-form-label fw-bold">Pace Max</label>
                        <div className="col-sm-9">
                            <input
                                id="Input_PaceMax"
                                type="number"
                                className="form-control"
                                value={gpsSession.paceMax}
                                onChange={e => handleChange('paceMax', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="offset-sm-3 col-sm-9 d-flex justify-content-end">
                            <button type="button" className="btn btn-outline-secondary" onClick={cancel}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success ms-2" disabled={requestIsOngoing}>
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
