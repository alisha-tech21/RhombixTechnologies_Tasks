const mongoose = require("mongoose");
require("dotenv").config();

const Destination = require("./models/Destination");
const Property = require("./models/Property");
const Room = require("./models/Room");
const Deal = require("./models/Deal");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Travel_system";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected.");

    // =========================================================
    // 1. CLEAR EXISTING DATA
    // =========================================================

    await Promise.all([
      Destination.deleteMany({}),
      Property.deleteMany({}),
      Room.deleteMany({}),
      Deal.deleteMany({}),
    ]);

    console.log("Old data cleared.");

    // =========================================================
    // 2. DESTINATIONS
    // =========================================================

    const destinations = await Destination.insertMany([
      {
        name: "Maldives",
        country: "Maldives",
        region: "Asia",
        description:
          "A tropical paradise featuring crystal clear waters, overwater villas and pristine white sandy beaches.",
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 650,
      },
      {
        name: "Paris",
        country: "France",
        region: "Europe",
        description:
          "Discover romantic streets, iconic landmarks, world-class cuisine and timeless French elegance.",
        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 500,
      },
      {
        name: "Hunza",
        country: "Pakistan",
        region: "Asia",
        description:
          "Explore majestic mountains, peaceful valleys, beautiful lakes and the natural beauty of northern Pakistan.",
        images: [
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 180,
      },
      {
        name: "Dubai",
        country: "United Arab Emirates",
        region: "Middle East",
        description:
          "Enjoy luxury shopping, breathtaking architecture, desert adventures and world-class hospitality.",
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 600,
      },
      {
        name: "Bali",
        country: "Indonesia",
        region: "Asia",
        description:
          "Relax among tropical beaches, lush landscapes, cultural temples and peaceful island retreats.",
        images: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 400,
      },
      {
        name: "Zermatt",
        country: "Switzerland",
        region: "Europe",
        description:
          "Enjoy snowy Alpine landscapes, mountain adventures and charming Swiss chalet experiences.",
        images: [
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 1000,
      },
      {
        name: "Kyoto",
        country: "Japan",
        region: "Asia",
        description:
          "Experience traditional Japanese culture, peaceful temples, gardens and historic neighborhoods.",
        images: [
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 350,
      },
      {
        name: "Santorini",
        country: "Greece",
        region: "Europe",
        description:
          "Discover whitewashed villages, blue-domed buildings, stunning sunsets and beautiful Aegean views.",
        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
        ],
        priceFrom: 900,
      },
    ]);

    console.log(`${destinations.length} destinations inserted.`);

    // =========================================================
    // 3. DESTINATION REFERENCES
    // =========================================================

    const [maldives, paris, hunza, dubai, bali, zermatt, kyoto, santorini] =
      destinations;

    // =========================================================
    // 4. PROPERTIES
    // =========================================================

    const properties = await Property.insertMany([
      // =======================================================
      // 1. MALDIVES
      // =======================================================

      {
        destinationId: maldives._id,
        name: "Azure Overwater Villa",
        type: "Villa",
        address: "North Malé Atoll, Maldives",

        location: {
          lat: 4.1755,
          lng: 73.5093,
        },

        description:
          "A luxurious overwater villa offering direct lagoon access, private relaxation areas and breathtaking ocean views.",

        rating: 4.9,
        reviewCount: 328,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Swimming Pool",
          "Private Beach",
          "Air Conditioning",
          "Ocean View",
          "Spa",
          "Airport Transfer",
        ],

        images: [
          "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 720,
      },

      // =======================================================
      // 2. BALI
      // =======================================================

      {
        destinationId: bali._id,
        name: "The Seminyak Sanctuary",
        type: "Resort",
        address: "Seminyak, Bali, Indonesia",

        location: {
          lat: -8.6913,
          lng: 115.1689,
        },

        description:
          "A tropical resort in Seminyak featuring elegant rooms, relaxing pool areas and easy access to Bali's beaches.",

        rating: 4.8,
        reviewCount: 256,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Swimming Pool",
          "Spa",
          "Restaurant",
          "Air Conditioning",
          "Beach Access",
        ],

        images: [
          "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 420,
      },

      // =======================================================
      // 3. ZERMATT
      // =======================================================

      {
        destinationId: zermatt._id,
        name: "Swiss Alps Snowy Chalet",
        type: "Hotel",
        address: "Zermatt, Valais, Switzerland",

        location: {
          lat: 46.0207,
          lng: 7.7491,
        },

        description:
          "A cozy Alpine chalet surrounded by snowy mountains, perfect for a peaceful winter escape.",

        rating: 4.9,
        reviewCount: 184,

        amenities: [
          "Free WiFi",
          "Mountain View",
          "Fireplace",
          "Heating",
          "Breakfast",
          "Ski Storage",
          "Parking",
        ],

        images: [
          "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 1250,
      },

      // =======================================================
      // 4. KYOTO
      // =======================================================

      {
        destinationId: kyoto._id,
        name: "Kyoto Traditional Ryokan",
        type: "Hotel",
        address: "Higashiyama, Kyoto, Japan",

        location: {
          lat: 35.0037,
          lng: 135.7788,
        },

        description:
          "A traditional Japanese ryokan offering an authentic Kyoto stay with peaceful surroundings and cultural charm.",

        rating: 4.8,
        reviewCount: 201,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Garden",
          "Air Conditioning",
          "Traditional Dining",
          "Spa",
        ],

        images: [
          "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 380,
      },

      // =======================================================
      // 5. SANTORINI
      // =======================================================

      {
        destinationId: santorini._id,
        name: "Santorini Caldera View Suite",
        type: "Hotel",
        address: "Oia, Santorini, Greece",

        location: {
          lat: 36.4618,
          lng: 25.3753,
        },

        description:
          "An elegant Santorini suite with spectacular Caldera views, private outdoor space and romantic surroundings.",

        rating: 4.9,
        reviewCount: 295,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Swimming Pool",
          "Sea View",
          "Air Conditioning",
          "Restaurant",
          "Airport Transfer",
        ],

        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1555400038-3e0b4e8f7e1a?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 990,
      },

      // =======================================================
      // 6. MALDIVES SECOND
      // =======================================================

      {
        destinationId: maldives._id,
        name: "Maldives Overwater Lagoon",
        type: "Resort",
        address: "South Malé Atoll, Maldives",

        location: {
          lat: 3.9,
          lng: 73.5,
        },

        description:
          "A beautiful lagoon resort offering peaceful overwater accommodation and stunning tropical views.",

        rating: 4.7,
        reviewCount: 176,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Swimming Pool",
          "Private Beach",
          "Spa",
          "Ocean View",
          "Restaurant",
        ],

        images: [
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 650,
      },

      // =======================================================
      // 7. PARIS
      // =======================================================

      {
        destinationId: paris._id,
        name: "Le Grand Parisian Hotel",
        type: "Hotel",
        address: "Paris, France",

        location: {
          lat: 48.8566,
          lng: 2.3522,
        },

        description:
          "A sophisticated Parisian hotel located near iconic attractions, restaurants and elegant shopping streets.",

        rating: 4.7,
        reviewCount: 412,

        amenities: [
          "Free WiFi",
          "Breakfast",
          "Restaurant",
          "Room Service",
          "Air Conditioning",
          "Fitness Center",
          "City View",
        ],

        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 599,
      },

      // =======================================================
      // 8. HUNZA
      // =======================================================

      {
        destinationId: hunza._id,
        name: "Hunza Valley Heights",
        type: "Resort",
        address: "Karimabad, Hunza, Pakistan",

        location: {
          lat: 36.3167,
          lng: 74.65,
        },

        description:
          "A peaceful mountain retreat with panoramic views of Hunza Valley and surrounding peaks.",

        rating: 4.8,
        reviewCount: 143,

        amenities: [
          "Free WiFi",
          "Mountain View",
          "Breakfast",
          "Restaurant",
          "Parking",
          "Heating",
          "Garden",
        ],

        images: [
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 180,
      },

      // =======================================================
      // 9. DUBAI
      // =======================================================

      {
        destinationId: dubai._id,
        name: "Downtown Burj Suites",
        type: "Apartment",
        address: "Downtown Dubai, UAE",

        location: {
          lat: 25.1972,
          lng: 55.2744,
        },

        description:
          "Modern luxury suites in Downtown Dubai, close to Burj Khalifa, Dubai Mall and major attractions.",

        rating: 4.8,
        reviewCount: 367,

        amenities: [
          "Free WiFi",
          "Swimming Pool",
          "Gym",
          "City View",
          "Air Conditioning",
          "Parking",
          "Room Service",
        ],

        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
        ],

        pricePerNight: 699,
      },
    ]);

    console.log(`${properties.length} properties inserted.`);

    // =========================================================
    // 5. PROPERTY REFERENCES
    // =========================================================

    const [
      azureVilla,
      baliSanctuary,
      swissChalet,
      kyotoRyokan,
      santoriniSuite,
      maldivesLagoon,
      parisHotel,
      hunzaHeights,
      dubaiSuites,
    ] = properties;

    // =========================================================
    // 6. ROOMS
    // =========================================================

    const rooms = await Room.insertMany([
      {
        propertyId: azureVilla._id,
        name: "Ocean Villa",
        type: "Villa",
        pricePerNight: 720,
        capacity: 2,
        guests: 2,
        amenities: ["Ocean View", "Private Pool", "Breakfast", "Free WiFi"],
        images: [
          "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: baliSanctuary._id,
        name: "Deluxe Tropical Room",
        type: "Deluxe",
        pricePerNight: 420,
        capacity: 2,
        guests: 2,
        amenities: ["Pool Access", "Breakfast", "Free WiFi"],
        images: [
          "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: swissChalet._id,
        name: "Alpine Suite",
        type: "Suite",
        pricePerNight: 1250,
        capacity: 4,
        guests: 2,
        amenities: ["Mountain View", "Fireplace", "Breakfast", "Heating"],
        images: [
          "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: kyotoRyokan._id,
        name: "Traditional Japanese Room",
        type: "Traditional",
        pricePerNight: 380,
        capacity: 2,
        guests: 2,
        amenities: ["Garden View", "Breakfast", "Traditional Dining"],
        images: [
          "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: santoriniSuite._id,
        name: "Caldera View Suite",
        type: "Suite",
        pricePerNight: 990,
        capacity: 2,
        guests: 2,
        amenities: ["Sea View", "Breakfast", "Swimming Pool"],
        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: maldivesLagoon._id,
        name: "Lagoon Deluxe Villa",
        type: "Villa",
        pricePerNight: 650,
        capacity: 2,
        guests: 2,
        amenities: ["Ocean View", "Private Beach", "Breakfast"],
        images: [
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: parisHotel._id,
        name: "Paris Deluxe Room",
        type: "Deluxe",
        pricePerNight: 599,
        capacity: 2,
        guests: 2,
        amenities: ["City View", "Breakfast", "Free WiFi"],
        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: hunzaHeights._id,
        name: "Mountain View Room",
        type: "Deluxe",
        pricePerNight: 180,
        capacity: 2,
        guests: 2,
        amenities: ["Mountain View", "Breakfast", "Heating"],
        images: [
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80",
        ],
      },

      {
        propertyId: dubaiSuites._id,
        name: "Downtown Luxury Suite",
        type: "Suite",
        pricePerNight: 699,
        capacity: 4,
        guests: 4,
        amenities: ["City View", "Swimming Pool", "Gym", "Free WiFi"],
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
        ],
      },
    ]);

    console.log(`${rooms.length} rooms inserted.`);

    // =========================================================
    // 7. DEALS
    // =========================================================

    const deals = await Deal.insertMany([
      {
        title: "Summer Escape Getaway",
        destinationId: maldives._id,
        propertyId: azureVilla._id,

        durationDays: 4,
        durationNights: 3,

        price: 720,

        includes: ["Resort", "Breakfast", "Ocean View"],

        // Backend image is NOT used by Deals.jsx.
        // Deals.jsx keeps beach.png.
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },

      {
        title: "Bali Tropical Escape",
        destinationId: bali._id,
        propertyId: baliSanctuary._id,

        durationDays: 5,
        durationNights: 4,

        price: 420,

        includes: ["Resort", "Breakfast", "Pool Access"],

        images: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },

      {
        title: "Romantic Paris Stay",
        destinationId: paris._id,
        propertyId: parisHotel._id,

        durationDays: 4,
        durationNights: 3,

        price: 599,

        includes: ["Hotel", "Breakfast", "City Tour"],

        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },

      {
        title: "Luxury Dubai Trip",
        destinationId: dubai._id,
        propertyId: dubaiSuites._id,

        durationDays: 5,
        durationNights: 4,

        price: 699,

        includes: ["Luxury Apartment", "Breakfast", "City Tour"],

        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },

      {
        title: "Swiss Alps Snowy Escape",
        destinationId: zermatt._id,
        propertyId: swissChalet._id,

        durationDays: 6,
        durationNights: 5,

        price: 1250,

        includes: [
          "Mountain Chalet",
          "Breakfast",
          "Mountain View",
          "Ski Storage",
        ],

        images: [
          "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },

      {
        title: "Santorini Romantic Escape",
        destinationId: santorini._id,
        propertyId: santoriniSuite._id,

        durationDays: 5,
        durationNights: 4,

        price: 990,

        includes: [
          "Luxury Suite",
          "Breakfast",
          "Caldera View",
          "Swimming Pool",
        ],

        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
        ],

        validTill: new Date("2026-12-31"),
        isActive: true,
      },
    ]);

    console.log(`${deals.length} deals inserted.`);

    // =========================================================
    // 8. FINAL OUTPUT
    // =========================================================

    console.log("\n========================================");
    console.log("          SEED COMPLETE");
    console.log("========================================");

    console.log(`Destinations : ${destinations.length}`);
    console.log(`Properties   : ${properties.length}`);
    console.log(`Rooms        : ${rooms.length}`);
    console.log(`Deals        : ${deals.length}`);

    console.log("\nDeal → Property mapping:");

    deals.forEach((deal) => {
      console.log(`${deal.title} → ${deal.propertyId.toString()}`);
    });

    console.log("========================================\n");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("\nSeed failed:");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedDatabase();
