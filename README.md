# AI Farm Frontend

A React-based web application for the AI Farm crop recommendation system. This frontend provides an intuitive interface for users to input soil and weather conditions and receive AI-powered crop recommendations.

## Features

- **Interactive Form**: Easy-to-use form for entering soil nutrients (N, P, K) and environmental conditions
- **Real-time Validation**: Client-side validation with helpful error messages
- **Beautiful UI**: Modern, responsive design with glassmorphism effects
- **AI Integration**: Seamlessly connects to the Flask backend API
- **Loading States**: Engaging loading animations while processing predictions
- **Detailed Results**: Comprehensive display of crop recommendations with confidence levels
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## Technology Stack

- **React 18** - Modern React with hooks
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with glassmorphism effects
- **JavaScript ES6+** - Modern JavaScript features

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- AI Farm backend server running on port 5000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Environment Configuration

The app automatically detects the environment:
- **Development**: Connects to `http://localhost:5000/api`
- **Production**: Uses relative API paths

### Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## Project Structure

```
src/
├── components/
│   ├── Header.js              # Application header with branding
│   ├── Header.css
│   ├── CropPredictionForm.js  # Main input form component
│   ├── CropPredictionForm.css
│   ├── ResultDisplay.js       # Results display component
│   ├── ResultDisplay.css
│   ├── LoadingSpinner.js      # Loading animation component
│   └── LoadingSpinner.css
├── services/
│   └── apiService.js          # API communication service
├── App.js                     # Main application component
├── App.css                    # Application-wide styles
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## API Integration

The frontend communicates with the Flask backend through the `/api/predict` endpoint:

### Request Format
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.88,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.94
}
```

### Response Format
```json
{
  "status": "success",
  "data": {
    "predicted_crop": "rice",
    "confidence": 0.95,
    "recommendations": [
      "Ensure proper irrigation",
      "Monitor soil pH levels"
    ]
  }
}
```

## Form Validation

The application includes comprehensive client-side validation:

- **Required Fields**: All 7 parameters must be provided
- **Numeric Validation**: Ensures all inputs are valid numbers
- **Range Validation**: Checks values are within realistic agricultural ranges
- **Real-time Feedback**: Shows validation errors as users type

## Input Parameters

| Parameter | Label | Unit | Range | Description |
|-----------|-------|------|-------|-------------|
| N | Nitrogen | kg/ha | 0-140 | Nitrogen content in soil |
| P | Phosphorus | kg/ha | 5-145 | Phosphorus content in soil |
| K | Potassium | kg/ha | 5-205 | Potassium content in soil |
| temperature | Temperature | °C | 8-44 | Average temperature |
| humidity | Humidity | % | 14-100 | Relative humidity |
| ph | pH Level | - | 3.5-9.9 | Soil pH level |
| rainfall | Rainfall | mm | 20-300 | Annual rainfall |

## Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (up to 767px)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure the Flask backend is running on port 5000
2. **Form Validation**: Check that all values are within the specified ranges
3. **Network Issues**: Verify CORS is properly configured on the backend

### Development Tips

- Use browser developer tools to inspect network requests
- Check the console for detailed error messages
- Ensure the backend server is accessible from the frontend

## Contributing

1. Follow React best practices
2. Maintain consistent code formatting
3. Add proper error handling
4. Test on multiple screen sizes
5. Document any new features

## License

This project is part of the AI Farm system for educational purposes.