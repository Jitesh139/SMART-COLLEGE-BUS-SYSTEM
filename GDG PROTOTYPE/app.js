/**
 * Smart College Bus Status System - Core Logic
 * Handles data persistence via localStorage and shared utilities.
 */

const STORAGE_KEY = 'college_bus_data';

// Initial Mock Data
const INITIAL_DATA = [
    {
        id: 'BUS01',
        route: 'City Center',
        number: 'KA-01-F-1234',
        status: 'ON_TIME',
        location: 'GATE_1',
        lastUpdated: Date.now(),
        driverId: 'DRV01',
        driverName: 'Ramesh Kumar',
        tripType: 'SENIOR',
        stops: ['Main Gate', 'City Center', 'Library'],
        mapUrl: ''
    },
    {
        id: 'BUS02',
        route: 'North Campus',
        number: 'KA-04-A-5678',
        status: 'LATE_5',
        location: 'BTWN_G1_G2',
        lastUpdated: Date.now() - 300000, // 5 mins ago
        driverId: 'DRV02',
        driverName: 'Suresh Singh',
        tripType: 'JUNIOR',
        stops: []
    },
    {
        id: 'BUS03',
        route: 'South Extension',
        number: 'KA-05-B-9012',
        status: 'CANCELLED',
        location: 'GARAGE',
        lastUpdated: Date.now() - 3600000, // 1 hour ago
        driverId: 'DRV03',
        driverName: 'Mahesh Gupta',
        tripType: 'SENIOR',
        stops: []
    }
];

// Status Definitions for UI Mapping
const STATUS_MAP = {
    'ON_TIME': { label: 'On Time', class: 'status-ontime' },
    'LATE_3': { label: 'Late by 3 mins', class: 'status-late' },
    'LATE_5': { label: 'Late by 5 mins', class: 'status-late' },
    'LATE_10': { label: 'Late by 10 mins', class: 'status-late' },
    'LATE_15': { label: 'Late by 15 mins', class: 'status-late' },
    'CANCELLED': { label: 'Cancelled Today', class: 'status-cancelled' }
};

const LOCATION_MAP = {
    'BEHIND_GATE_1': 'Behind Gate 1',
    'BTWN_G1_G2': 'Between Gate 1 & 2',
    'FRONT_GATE_2': 'In front of Gate 2',
    'ORIENTAL_SCHOOL': 'In front of Oriental School'
};

class BusSystem {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        }
    }

    getAllBuses() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    getBusById(id) {
        const buses = this.getAllBuses();
        return buses.find(b => b.id === id);
    }

    getBusByDriverId(driverId) {
        const buses = this.getAllBuses();
        return buses.find(b => b.driverId === driverId);
    }

    updateBusStatus(busId, newStatus, newLocation) {
        const buses = this.getAllBuses();
        const index = buses.findIndex(b => b.id === busId);

        if (index !== -1) {
            buses[index].status = newStatus;
            if (newLocation) buses[index].location = newLocation;
            buses[index].lastUpdated = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
            return true;
        }
        return false;
        return false;
    }

    updateBusStops(busId, stops, mapUrl) {
        const buses = this.getAllBuses();
        const index = buses.findIndex(b => b.id === busId);

        if (index !== -1) {
            buses[index].stops = stops;
            if (mapUrl !== undefined) buses[index].mapUrl = mapUrl;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
            return true;
        }
        return false;
    }

    saveBus(busData) {
        const buses = this.getAllBuses();
        const index = buses.findIndex(b => b.id === busData.id);

        if (index !== -1) {
            // Update existing
            buses[index] = { ...buses[index], ...busData };
        } else {
            // Create new
            buses.push(busData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
    }

    deleteBus(busId) {
        let buses = this.getAllBuses();
        buses = buses.filter(b => b.id !== busId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
    }

    // Helper to format time relative (e.g., "Just now", "5 mins ago")
    formatTime(timestamp) {
        const diff = Math.floor((Date.now() - timestamp) / 60000); // minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff} min ago`;
        const hours = Math.floor(diff / 60);
        return `${hours} hr ago`;
    }
}

// Export instance
const busSystem = new BusSystem();
