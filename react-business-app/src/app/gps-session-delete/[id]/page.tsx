'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { IGpsSession } from '@/domain/IGpsSessionResponse';
import type { IResultObject } from '@/types/IResultObject';
import { GpsSessionService } from '@/service/GpsSessionService';

export default function DeleteGpsSessionPage() {
    const gpsSessionService = new GpsSessionService()
    const router = useRouter();
    const { id } = useParams();
    const sessionId = id as string;

    const [requestIsOngoing, setRequestIsOngoing] = useState(false);
    const [gpsSessionData, setGpsSessionData] = useState<IResultObject<IGpsSession>>({});

    useEffect(() => {
        const fetchData = async () => {
            setRequestIsOngoing(true);
            try {
                const result = await gpsSessionService.getByIdAsync(sessionId);
                setGpsSessionData(result);
            } catch (error) {
                console.error('Error fetching session data:', error);
            } finally {
                setRequestIsOngoing(false);
            }
        };

        fetchData();
    }, [sessionId]);

    const cancel = () => {
        router.push('/gps-session');
    };

    const deleteSession = async () => {
        setRequestIsOngoing(true);
        try {
            const result = await gpsSessionService.deleteAsync(sessionId);
            if (result.errors) {
                setGpsSessionData(prev => ({ ...prev, errors: result.errors }));
            } else {
                router.push('/gps-session');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        } finally {
            setRequestIsOngoing(false);
        }
    };

    return (
        <div className="container mt-4">
            {gpsSessionData.errors && (
                <div className="alert alert-warning" role="alert">
                    {gpsSessionData.errors}
                </div>
            )}

            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Delete Session</h2>
                <p>Are you sure you want to delete the following session?</p>

                <ul className="list-group mb-4">
                    <li className="list-group-item">
                        <strong>Name:</strong> {gpsSessionData.data?.name}
                    </li>
                    <li className="list-group-item">
                        <strong>Description:</strong> {gpsSessionData.data?.description}
                    </li>
                    <li className="list-group-item">
                        <strong>Recorded At:</strong> {gpsSessionData.data?.recordedAt}
                    </li>
                    <li className="list-group-item">
                        <strong>Pace Min:</strong> {gpsSessionData.data?.paceMin}
                    </li>
                    <li className="list-group-item">
                        <strong>Pace Max:</strong> {gpsSessionData.data?.paceMax}
                    </li>
                </ul>

                <div className="d-flex justify-content-end">
                    <button onClick={cancel} className="btn btn-outline-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={deleteSession}
                        className="btn btn-danger ms-2"
                        disabled={requestIsOngoing}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
