// import mongoose from 'mongoose';
// import { Schema, model } from 'mongoose';
// const PackingItemSchema = new Schema({
//     name: {
//         type: String,
//         required: [true]
//     },

//     quantity: {
//         type: Number,
//         min: [1, 'min qty=1'],
//         required: true
//     },
//     isPacked: {
//         type: Boolean,
//         default: false
//     },
//     category: {
//         type: String,
//         required: true,
//         // ADDED 'Accessories' to the list of valid categories
//         enum: ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Other','Personal', 'Accessories']
//     }
// });

// const TripSchema = new Schema({
//     tripName: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     destinationCity: {
//         type: String,
//         required: true
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true,
//         validate: {
//             validator: function (v) {
//                 return v >= this.startDate;
//             },
//             message: 'End date >= start Date'
//         }
//     },
//     routeWaypoints: {
//         type: [Object],
//         default: []
//     },
//     packingList: {
//         type: [PackingItemSchema],
//         default: []
//     },
//     destinationInfo: {
//         description: { type: String, default: "" },
//         currency: { type: String, default: "N/A" },
//         language: { type: String, default: "N/A" },
//         weatherSummary: { type: String, default: "" },
//         currentTemp: { type: Number, default: null }
//     },
//     editorial: {
//         topAttractions: { type: String, default: "Synchronizing data..." },
//         localCuisine: { type: String, default: "Synchronizing data..." },
//         geography: { type: String, default: "Synchronizing data..." }
//     },

//     landmarks: [{
//         name: { type: String, required: true },
//         lat: { type: Number, required: true },
//         lng: { type: Number, required: true }
//     }],
    

//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true, //
//     }
// }, {
//     timestamps: true
// });
// export default model('Trip', TripSchema);

import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

// --- NEW ADDITION: Activity Sub-Schema ---
const ActivitySchema = new Schema({
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { 
        type: String, 
        enum: ['Transit', 'Accommodation', 'Sightseeing', 'Dining'],
        default: 'Sightseeing'
    }
});

// --- NEW ADDITION: Day Sub-Schema ---
const DaySchema = new Schema({
    dayNumber: { type: Number, required: true },
    date: { type: Date },
    activities: [ActivitySchema] 
});

// --- EXISTING: Packing Item Schema ---
const PackingItemSchema = new Schema({
    name: {
        type: String,
        required: [true]
    },
    quantity: {
        type: Number,
        min: [1, 'min qty=1'],
        required: true
    },
    isPacked: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Other','Personal', 'Accessories']
    }
});

// --- UPDATED: Main Trip Schema ---
const TripSchema = new Schema({
    tripName: {
        type: String,
        required: true,
        trim: true
    },
    destinationCity: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v >= this.startDate;
            },
            message: 'End date >= start Date'
        }
    },
    routeWaypoints: {
        type: [Object],
        default: []
    },
    packingList: {
        type: [PackingItemSchema],
        default: []
    },
    destinationInfo: {
        description: { type: String, default: "" },
        currency: { type: String, default: "N/A" },
        language: { type: String, default: "N/A" },
        weatherSummary: { type: String, default: "" },
        currentTemp: { type: Number, default: null }
    },
    editorial: {
        topAttractions: { type: String, default: "Synchronizing data..." },
        localCuisine: { type: String, default: "Synchronizing data..." },
        geography: { type: String, default: "Synchronizing data..." }
    },
    landmarks: [{
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }],
    
    // --- NEW ADDITION: The Itinerary Array ---
    itinerary: [DaySchema],

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    }
}, {
    timestamps: true
});

export default model('Trip', TripSchema);