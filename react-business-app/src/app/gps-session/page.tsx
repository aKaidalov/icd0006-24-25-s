"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { GpsSessionService } from "@/service/GpsSessionService";
import { IGpsSession } from "@/domain/IGpsSessionResponse";
import { IResultObject } from "@/types/IResultObject";

function toISOStringLocal(date: Date): string {
    return date.toISOString().slice(0, 16);
}

const getDefaultFilters = () => {
    const fromDate = new Date('2020-01-01T00:00:00.000Z');
    const toDate = new Date(Date.now() + 3 * 60 * 60 * 1000); // UTC + 3h

    return {
        minLocationsCount: 0,
        minDuration: 0,
        minDistance: 0,
        fromDateTime: toISOStringLocal(fromDate),
        toDateTime: toISOStringLocal(toDate)
    };
};

export default function GpsSessionsPage() {
    const gpsSessionService = new GpsSessionService()
    const [gpsSessionData, setGpsSessionData] = useState<IResultObject<IGpsSession[]>>({});
    const [filters, setFilters] = useState(getDefaultFilters());

    const fetchFilteredData = async () => {
        try {
            const result = await gpsSessionService.getFilteredAsync(filters);
            setGpsSessionData({
                data: result.data,
                errors: result.errors
            });
        } catch (error) {
            console.error("Error fetching filtered data", error);
        }
    };

    const resetFilters = () => {
        setFilters(getDefaultFilters());
        fetchFilteredData();
    };

    useEffect(() => {
        fetchFilteredData();
    }, []);

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString("et-EE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="container mt-4">
            {gpsSessionData.errors && (
                <div className="alert alert-warning mt-3">
                    {gpsSessionData.errors}
                </div>
            )}

            <h1>
                <span>GpsSessions</span>
                <Link href="/gps-session-create" className="btn btn-success btn-sm ms-2">+</Link>
            </h1>

            <div className="card p-3 mb-4 shadow-sm">
                <div className="row g-3 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label">Min Locations</label>
                        <input
                            type="number"
                            className="form-control"
                            value={filters.minLocationsCount}
                            onChange={(e) => setFilters({ ...filters, minLocationsCount: Number(e.target.value) })}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Min Duration</label>
                        <input
                            type="number"
                            className="form-control"
                            value={filters.minDuration}
                            onChange={(e) => setFilters({ ...filters, minDuration: Number(e.target.value) })}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Min Distance</label>
                        <input
                            type="number"
                            className="form-control"
                            value={filters.minDistance}
                            onChange={(e) => setFilters({ ...filters, minDistance: Number(e.target.value) })}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">From Date</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={filters.fromDateTime}
                            onChange={(e) => setFilters({ ...filters, fromDateTime: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">To Date</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={filters.toDateTime}
                            onChange={(e) => setFilters({ ...filters, toDateTime: e.target.value })}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-secondary btn-sm me-2" onClick={resetFilters}>Reset</button>
                    <button className="btn btn-primary btn-sm" onClick={fetchFilteredData}>Filter</button>
                </div>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>RecordedAt</th>
                    <th>Locations</th>
                    <th>User</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {gpsSessionData.data?.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{formatDate(item.recordedAt)}</td>
                        <td>{item.gpsLocationsCount}</td>
                        <td>{item.userFirstLastName}</td>
                        <td>
                            <Link href={`/gps-session-edit/${item.id}`} className="text-warning mx-1"><i
                                className="bi bi-pencil"></i>
                            </Link><br/>
                            <Link href={`/gps-session-details/${item.id}`} className="mx-1">
                                <i className="bi bi-info-circle"></i>
                            </Link><br/>
                            <Link href={`/gps-session-delete/${item.id}`} className="text-danger mx-1">
                                <i className="bi bi-trash"></i>
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
