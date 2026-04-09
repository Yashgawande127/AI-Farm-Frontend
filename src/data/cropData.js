// Comprehensive crop data with images and growing conditions
export const cropData = {
  rice: {
    name: 'Rice',
    image: 'https://2.wlimg.com/product_images/bc-full/2019/2/1878410/long-grain-non-basmati-rice-1549007210-902119.jpeg',
    description: 'A staple grain crop that feeds more than half of the world\'s population.',
    conditions: {
      climate: 'Warm and humid climate with abundant rainfall',
      soil: {
        type: 'Clay or loam soil with good water retention',
        ph: '5.5 - 6.5 (slightly acidic)',
        nitrogen: 'High (80-120 kg/ha)',
        phosphorus: 'Medium (40-60 kg/ha)',
        potassium: 'Medium (40-60 kg/ha)'
      },
      water: 'Requires continuous flooding or frequent irrigation',
      temperature: '20-30°C (68-86°F)',
      humidity: '80-85%',
      rainfall: '150-300 cm annually',
      season: 'Monsoon season (June-October)',
      harvesting: '110-150 days after planting'
    }
  },
  maize: {
    name: 'Maize (Corn)',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxQeTo_Y0EX8qLhftNvihQ1Oo3Eu2s4eDL8g&s',
    description: 'A versatile cereal grain used for food, feed, and industrial purposes.',
    conditions: {
      climate: 'Warm temperate to subtropical climate',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'High (120-150 kg/ha)',
        phosphorus: 'Medium (60-80 kg/ha)',
        potassium: 'High (60-80 kg/ha)'
      },
      water: 'Moderate water requirements with good drainage',
      temperature: '21-27°C (70-80°F)',
      humidity: '60-70%',
      rainfall: '50-100 cm during growing season',
      season: 'Spring to summer (March-July)',
      harvesting: '90-120 days after planting'
    }
  },
  wheat: {
    name: 'Wheat',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    description: 'A cereal grain that is a worldwide staple food and important source of carbohydrates.',
    conditions: {
      climate: 'Cool, moist climate during growth and warm, dry climate during ripening',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '6.0 - 7.5 (neutral to slightly alkaline)',
        nitrogen: 'High (100-150 kg/ha)',
        phosphorus: 'Medium (50-75 kg/ha)',
        potassium: 'Medium (50-75 kg/ha)'
      },
      water: 'Moderate water requirements',
      temperature: '15-25°C (59-77°F)',
      humidity: '50-70%',
      rainfall: '75-100 cm annually',
      season: 'Winter crop (October-April)',
      harvesting: '110-130 days after planting'
    }
  },
  cotton: {
    name: 'Cotton',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFp-vtBl5iO2ZpTfGeFoRg85WsMFM6DeaWNg&s',
    description: 'A soft, fluffy staple fiber that is an important cash crop.',
    conditions: {
      climate: 'Hot and humid climate with long growing season',
      soil: {
        type: 'Deep, well-drained alluvial soil',
        ph: '6.0 - 8.0 (neutral to slightly alkaline)',
        nitrogen: 'High (120-160 kg/ha)',
        phosphorus: 'High (60-80 kg/ha)',
        potassium: 'High (60-80 kg/ha)'
      },
      water: 'High water requirements during flowering',
      temperature: '21-30°C (70-86°F)',
      humidity: '60-70%',
      rainfall: '50-100 cm during growing season',
      season: 'Summer crop (April-October)',
      harvesting: '150-180 days after planting'
    }
  },
  sugarcane: {
    name: 'Sugarcane',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM5ELhWpoYOVHaDPJ79BG0GDLLjKybFv-Fg&s',
    description: 'A tropical grass that is the primary source of sugar production.',
    conditions: {
      climate: 'Hot and humid tropical or subtropical climate',
      soil: {
        type: 'Deep, fertile loamy soil with good drainage',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Very High (200-300 kg/ha)',
        phosphorus: 'High (80-120 kg/ha)',
        potassium: 'Very High (150-200 kg/ha)'
      },
      water: 'High water requirements throughout growing period',
      temperature: '26-32°C (79-90°F)',
      humidity: '75-85%',
      rainfall: '150-250 cm annually',
      season: 'Year-round in suitable climates',
      harvesting: '10-24 months after planting'
    }
  },
  coconut: {
    name: 'Coconut',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bqrl1U3YhTW4AwZNYDCgTTnJ3iOcvuiULg&s',
    description: 'A versatile palm tree that provides coconuts, oil, and fiber.',
    conditions: {
      climate: 'Tropical coastal climate with high humidity',
      soil: {
        type: 'Sandy loam or alluvial soil with good drainage',
        ph: '5.5 - 7.0 (slightly acidic to neutral)',
        nitrogen: 'Medium (60-100 kg/palm/year)',
        phosphorus: 'Medium (40-60 kg/palm/year)',
        potassium: 'High (100-150 kg/palm/year)'
      },
      water: 'Consistent moisture with good drainage',
      temperature: '25-30°C (77-86°F)',
      humidity: '80-90%',
      rainfall: '150-250 cm annually',
      season: 'Year-round production after maturity',
      harvesting: 'Continuous after 6-8 years of planting'
    }
  },
  jute: {
    name: 'Jute',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYlBsEB5WEAD2-YvHgoueLN27GqRQaH-ifQ&s',
    description: 'A natural fiber crop used for making sacks, ropes, and textiles.',
    conditions: {
      climate: 'Warm and humid climate with high rainfall',
      soil: {
        type: 'Deep alluvial soil with good water retention',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Medium (80-100 kg/ha)',
        phosphorus: 'Medium (40-50 kg/ha)',
        potassium: 'Medium (40-50 kg/ha)'
      },
      water: 'High moisture requirements during growth',
      temperature: '25-35°C (77-95°F)',
      humidity: '70-90%',
      rainfall: '120-150 cm during growing season',
      season: 'Monsoon season (April-August)',
      harvesting: '120-150 days after planting'
    }
  },
  coffee: {
    name: 'Coffee',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0a-3uyQ9B4bVyJmbPEeawulA4SLxp7f2cXA&s',
    description: 'A popular beverage crop grown for its aromatic beans.',
    conditions: {
      climate: 'Tropical highland climate with moderate temperatures',
      soil: {
        type: 'Well-drained volcanic or mountain soil',
        ph: '6.0 - 6.5 (slightly acidic)',
        nitrogen: 'Medium (100-150 kg/ha)',
        phosphorus: 'Medium (50-75 kg/ha)',
        potassium: 'High (100-150 kg/ha)'
      },
      water: 'Moderate rainfall with dry harvesting season',
      temperature: '15-24°C (59-75°F)',
      humidity: '60-70%',
      rainfall: '150-200 cm annually',
      season: 'Year-round cultivation with seasonal harvesting',
      harvesting: '3-5 years after planting, then annually'
    }
  },
  apple: {
    name: 'Apple',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_Db0jJvWe6vYScLksI8qoM2WCeHfJnSBVw&s',
    description: 'A popular temperate fruit crop rich in nutrients and fiber.',
    conditions: {
      climate: 'Temperate climate with cold winters and mild summers',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'Medium (80-120 kg/ha)',
        phosphorus: 'Medium (50-80 kg/ha)',
        potassium: 'High (100-150 kg/ha)'
      },
      water: 'Moderate water requirements with good drainage',
      temperature: '15-25°C (59-77°F) growing season',
      humidity: '60-70%',
      rainfall: '100-125 cm annually',
      season: 'Spring flowering, autumn harvest',
      harvesting: '3-5 years after planting, then annually'
    }
  },
  orange: {
    name: 'Orange',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWy2deoCitSxEOI52ZF-v5s0YK5B74oDSDIQ&s',
    description: 'A citrus fruit rich in vitamin C and popular worldwide.',
    conditions: {
      climate: 'Subtropical to tropical climate with mild winters',
      soil: {
        type: 'Well-drained sandy loam soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'High (150-200 kg/ha)',
        phosphorus: 'Medium (75-100 kg/ha)',
        potassium: 'High (150-200 kg/ha)'
      },
      water: 'Regular irrigation with good drainage',
      temperature: '20-30°C (68-86°F)',
      humidity: '65-75%',
      rainfall: '100-150 cm annually',
      season: 'Year-round in suitable climates',
      harvesting: '3-4 years after planting, then seasonal'
    }
  },
  papaya: {
    name: 'Papaya',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZYT1tOS5o7hV4hje57tDhYLYd-f6WwZdDpg&s',
    description: 'A tropical fruit tree that produces vitamin-rich papayas year-round.',
    conditions: {
      climate: 'Warm tropical climate with consistent temperatures',
      soil: {
        type: 'Well-drained sandy loam soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'High (200-300 kg/ha)',
        phosphorus: 'High (100-150 kg/ha)',
        potassium: 'Very High (200-300 kg/ha)'
      },
      water: 'Regular watering with excellent drainage',
      temperature: '25-30°C (77-86°F)',
      humidity: '70-80%',
      rainfall: '150-200 cm annually',
      season: 'Year-round cultivation and harvest',
      harvesting: '6-12 months after planting, continuous'
    }
  },
  banana: {
    name: 'Banana',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReDCQ09l3HLF2pYjRSK-3fNaQAUTOeLt_U7Q&s',
    description: 'A popular tropical fruit that is an excellent source of potassium.',
    conditions: {
      climate: 'Hot and humid tropical climate',
      soil: {
        type: 'Deep, fertile alluvial soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Very High (300-400 kg/ha)',
        phosphorus: 'High (100-150 kg/ha)',
        potassium: 'Very High (400-600 kg/ha)'
      },
      water: 'High water requirements with good drainage',
      temperature: '26-30°C (79-86°F)',
      humidity: '75-85%',
      rainfall: '200-250 cm annually',
      season: 'Year-round cultivation',
      harvesting: '9-15 months after planting, then continuous'
    }
  },
  mango: {
    name: 'Mango',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-2hFPpa70y8btNDOXtwzJZizRRqB5sxolAw&s',
    description: 'The king of fruits, known for its sweet taste and nutritional value.',
    conditions: {
      climate: 'Tropical to subtropical climate with dry and wet seasons',
      soil: {
        type: 'Deep, well-drained alluvial soil',
        ph: '5.5 - 7.5 (slightly acidic to neutral)',
        nitrogen: 'Medium (100-150 kg/ha)',
        phosphorus: 'Medium (50-100 kg/ha)',
        potassium: 'High (100-200 kg/ha)'
      },
      water: 'Moderate water with dry period for flowering',
      temperature: '24-30°C (75-86°F)',
      humidity: '70-80%',
      rainfall: '75-250 cm annually',
      season: 'Dry season flowering, wet season fruiting',
      harvesting: '3-5 years after planting, then seasonal'
    }
  },
  grapes: {
    name: 'Grapes',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCaSUv7rhNDxj6yq2R3a4kes3rLpSeRsQu8Q&s',
    description: 'A vine fruit used for eating fresh, making wine, and drying into raisins.',
    conditions: {
      climate: 'Mediterranean or temperate climate with dry summers',
      soil: {
        type: 'Well-drained sandy loam or clay loam soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Medium (60-100 kg/ha)',
        phosphorus: 'Medium (40-80 kg/ha)',
        potassium: 'High (100-150 kg/ha)'
      },
      water: 'Moderate water with good drainage',
      temperature: '15-25°C (59-77°F) growing season',
      humidity: '50-70%',
      rainfall: '50-100 cm annually',
      season: 'Spring growth, autumn harvest',
      harvesting: '2-3 years after planting, then annually'
    }
  },
  watermelon: {
    name: 'Watermelon',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCR2eBUKsjuLAl0oqz7YvkZJFU1C3znejG4g&s',
    description: 'A refreshing summer fruit with high water content and sweet taste.',
    conditions: {
      climate: 'Warm climate with long, hot growing season',
      soil: {
        type: 'Well-drained sandy loam soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'High (100-150 kg/ha)',
        phosphorus: 'Medium (50-80 kg/ha)',
        potassium: 'High (100-150 kg/ha)'
      },
      water: 'Regular irrigation during fruit development',
      temperature: '25-35°C (77-95°F)',
      humidity: '60-70%',
      rainfall: '50-75 cm during growing season',
      season: 'Summer crop (April-September)',
      harvesting: '80-100 days after planting'
    }
  },
  muskmelon: {
    name: 'Muskmelon',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs_klHGkb88uaT5AMyHAU1RB0OxyfAr7MHBg&s',
    description: 'A sweet, aromatic melon variety popular in summer months.',
    conditions: {
      climate: 'Warm, dry climate with hot days and cool nights',
      soil: {
        type: 'Well-drained sandy loam soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'High (120-150 kg/ha)',
        phosphorus: 'Medium (60-80 kg/ha)',
        potassium: 'High (120-150 kg/ha)'
      },
      water: 'Regular irrigation with reduced water near harvest',
      temperature: '25-35°C (77-95°F)',
      humidity: '50-70%',
      rainfall: '25-50 cm during growing season',
      season: 'Summer crop (March-July)',
      harvesting: '90-120 days after planting'
    }
  },
  lentil: {
    name: 'Lentil',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMcHtpQs4mPZanFvaRpslwhyve6f9YPSn6rg&s',
    description: 'A protein-rich legume crop that improves soil fertility.',
    conditions: {
      climate: 'Cool, dry climate with moderate temperatures',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Low (20-30 kg/ha) - fixes own nitrogen',
        phosphorus: 'High (60-80 kg/ha)',
        potassium: 'Medium (40-60 kg/ha)'
      },
      water: 'Moderate water requirements',
      temperature: '18-25°C (64-77°F)',
      humidity: '50-70%',
      rainfall: '25-50 cm during growing season',
      season: 'Winter crop (October-March)',
      harvesting: '95-110 days after planting'
    }
  },
  blackgram: {
    name: 'Black Gram',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwkT1pB69S-hAXxuNPS8zyp9l7E4_-UB9MWA&s',
    description: 'A protein-rich pulse crop also known as urad dal.',
    conditions: {
      climate: 'Warm climate with moderate rainfall',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Low (20-25 kg/ha) - fixes own nitrogen',
        phosphorus: 'High (50-60 kg/ha)',
        potassium: 'Medium (30-40 kg/ha)'
      },
      water: 'Moderate water requirements',
      temperature: '25-35°C (77-95°F)',
      humidity: '60-80%',
      rainfall: '60-100 cm during growing season',
      season: 'Kharif (June-October) or Rabi (November-April)',
      harvesting: '70-90 days after planting'
    }
  },
  pomegranate: {
    name: 'Pomegranate',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Qrz0t0Knqq19tbUx4fuBPTC2pJe6PFiZ-A&s',
    description: 'An antioxidant-rich fruit with medicinal properties.',
    conditions: {
      climate: 'Arid to semi-arid climate with hot, dry summers',
      soil: {
        type: 'Well-drained loamy soil',
        ph: '5.5 - 7.5 (slightly acidic to neutral)',
        nitrogen: 'Medium (100-120 kg/ha)',
        phosphorus: 'Medium (50-75 kg/ha)',
        potassium: 'High (100-150 kg/ha)'
      },
      water: 'Drought-tolerant but benefits from irrigation',
      temperature: '15-35°C (59-95°F)',
      humidity: '35-70%',
      rainfall: '50-100 cm annually',
      season: 'Spring flowering, autumn fruiting',
      harvesting: '2-3 years after planting, then biannual'
    }
  },
  chickpea: {
    name: 'Chickpea',
    image: 'https://forksandfoliage.com/wp-content/uploads/2023/02/how-to-cook-chickpeas-21-500x375.jpg',
    description: 'A nutritious legume also known as garbanzo beans or chana.',
    conditions: {
      climate: 'Cool, dry climate during growing period',
      soil: {
        type: 'Well-drained clay loam soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Low (20-25 kg/ha) - fixes own nitrogen',
        phosphorus: 'High (60-80 kg/ha)',
        potassium: 'Medium (40-50 kg/ha)'
      },
      water: 'Low to moderate water requirements',
      temperature: '20-25°C (68-77°F)',
      humidity: '60-70%',
      rainfall: '40-65 cm during growing season',
      season: 'Winter crop (October-March)',
      harvesting: '90-120 days after planting'
    }
  },
  kidneybeans: {
    name: 'Kidney Beans',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3tutDROonn0Yf0BOw_K9iRLudp739P7BMVg&s',
    description: 'A protein-rich legume crop also known as rajma.',
    conditions: {
      climate: 'Moderate climate with cool nights',
      soil: {
        type: 'Well-drained fertile loamy soil',
        ph: '6.0 - 7.0 (neutral)',
        nitrogen: 'Low (20-30 kg/ha) - fixes own nitrogen',
        phosphorus: 'High (60-80 kg/ha)',
        potassium: 'Medium (50-60 kg/ha)'
      },
      water: 'Moderate water requirements',
      temperature: '15-25°C (59-77°F)',
      humidity: '60-70%',
      rainfall: '75-100 cm during growing season',
      season: 'Kharif crop (June-October)',
      harvesting: '90-110 days after planting'
    }
  },
  pigeonpeas: {
    name: 'Pigeon Peas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqjchZkpSb1yAU2jFEs-Uj_DYKYBoHZmK_ag&s',
    description: 'A drought-tolerant legume crop also known as arhar or toor dal.',
    conditions: {
      climate: 'Semi-arid tropical climate',
      soil: {
        type: 'Well-drained sandy loam to clay loam soil',
        ph: '6.0 - 8.0 (neutral to slightly alkaline)',
        nitrogen: 'Low (20-25 kg/ha) - fixes own nitrogen',
        phosphorus: 'High (50-75 kg/ha)',
        potassium: 'Medium (40-50 kg/ha)'
      },
      water: 'Drought-tolerant, low water requirements',
      temperature: '20-35°C (68-95°F)',
      humidity: '60-80%',
      rainfall: '60-100 cm annually',
      season: 'Kharif crop (June-March)',
      harvesting: '150-240 days after planting'
    }
  },
  mothbeans: {
    name: 'Moth Beans',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgIBgZeOzicZdbhnTHLsR-UyVoukalftXkTQ&s',
    description: 'A drought-resistant legume crop native to arid regions.',
    conditions: {
      climate: 'Hot, arid climate with low rainfall',
      soil: {
        type: 'Sandy loam to clay loam soil',
        ph: '6.0 - 8.5 (neutral to alkaline)',
        nitrogen: 'Low (15-20 kg/ha) - fixes own nitrogen',
        phosphorus: 'Medium (30-40 kg/ha)',
        potassium: 'Low (20-30 kg/ha)'
      },
      water: 'Very drought-tolerant, minimal water needs',
      temperature: '25-40°C (77-104°F)',
      humidity: '40-60%',
      rainfall: '25-50 cm annually',
      season: 'Kharif crop (July-November)',
      harvesting: '75-90 days after planting'
    }
  },
  mungbean: {
    name: 'Mung Bean',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRizhGy8rL2zAIcJzPA95MHzP0TiWBPaqdzig&s',
    description: 'A fast-growing legume crop also known as green gram or moong.',
    conditions: {
      climate: 'Warm climate with moderate rainfall',
      soil: {
        type: 'Well-drained sandy loam soil',
        ph: '6.0 - 7.5 (neutral)',
        nitrogen: 'Low (15-20 kg/ha) - fixes own nitrogen',
        phosphorus: 'Medium (40-50 kg/ha)',
        potassium: 'Low (20-30 kg/ha)'
      },
      water: 'Low to moderate water requirements',
      temperature: '25-35°C (77-95°F)',
      humidity: '60-80%',
      rainfall: '50-75 cm during growing season',
      season: 'Kharif (June-September) or summer (March-May)',
      harvesting: '60-75 days after planting'
    }
  }
};

// Helper function to get crop data by name
export const getCropData = (cropName) => {
  if (!cropName || typeof cropName !== 'string') return null;
  const normalizedName = cropName.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  return cropData[normalizedName] || null;
};

// Get all available crops
export const getAllCrops = () => {
  return Object.keys(cropData).map(key => ({
    key,
    ...cropData[key]
  }));
};