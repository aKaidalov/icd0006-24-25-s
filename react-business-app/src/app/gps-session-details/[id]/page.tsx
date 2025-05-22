'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GpsSessionService } from '@/service/GpsSessionService';
import { IGpsSession } from '@/domain/IGpsSessionResponse';
import type { IResultObject } from '@/types/IResultObject';

export default function GpsSessionDetailsPage() {
    const router = useRouter();
    const gpsSessionService = new GpsSessionService()
    const { id } = useParams();
    const sessionId = id as string;

    const [requestIsOngoing, setRequestIsOngoing] = useState(true);
    const [gpsSessionData, setGpsSessionData] = useState<IResultObject<IGpsSession>>({});

    useEffect(() => {
        const fetchData = async () => {
            setRequestIsOngoing(true);
            try {
                const result = await gpsSessionService.getByIdAsync(sessionId);
                setGpsSessionData(result);
            } catch (error) {
                console.error('Error fetching session details:', error);
            } finally {
                setRequestIsOngoing(false);
            }
        };

        fetchData();
    }, [sessionId]);

    const cancel = () => {
        router.push('/gps-session');
    };

    return (
        <div className="container mt-4">
            {requestIsOngoing && <div>Loading session details...</div>}

            {!requestIsOngoing && gpsSessionData.errors && (
                <div className="alert alert-danger">{gpsSessionData.errors}</div>
            )}

            {!requestIsOngoing && gpsSessionData.data && (
                <div className="card shadow-sm p-4">
                    <h2 className="mb-4">GPS Session Details</h2>
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.id}</dd>

                        <dt className="col-sm-3">Name</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.name}</dd>

                        <dt className="col-sm-3">Description</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.description}</dd>

                        <dt className="col-sm-3">Recorded At</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.recordedAt}</dd>

                        <dt className="col-sm-3">Duration</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.duration}</dd>

                        <dt className="col-sm-3">Speed</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.speed}</dd>

                        <dt className="col-sm-3">Distance</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.distance}</dd>

                        <dt className="col-sm-3">Climb</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.climb}</dd>

                        <dt className="col-sm-3">Descent</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.descent}</dd>

                        <dt className="col-sm-3">Pace (min)</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.paceMin}</dd>

                        <dt className="col-sm-3">Pace (max)</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.paceMax}</dd>

                        <dt className="col-sm-3">Type</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.gpsSessionType}</dd>

                        <dt className="col-sm-3">Location Count</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.gpsLocationsCount}</dd>

                        <dt className="col-sm-3">User</dt>
                        <dd className="col-sm-9">{gpsSessionData.data.userFirstLastName}</dd>
                    </dl>
                </div>
            )}

            <div className="d-flex justify-content-end mt-4">
                <button onClick={cancel} className="btn btn-outline-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}
