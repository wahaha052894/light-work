<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Doctor Appointment Backend

<p align="center">A NestJS-based backend service for managing doctor appointments, including slot management, booking functionality, and retrieving scheduled appointments.</p>

## Technologies Used

- **NestJS**: For creating a modular, scalable Node.js backend.
- **MongoDB & Mongoose**: Database management.
- **date-fns**: Date handling and manipulation.

## Project Setup

### Prerequisites

- Node.js v18.x or higher
- MongoDB (local or cloud)
- Docker and Docker Compose (optional)

### Installation

Clone the repository:

```bash
git clone https://github.com/wahaha052894/light-work.git
cd light-work
```

Install dependencies:

```bash
npm install
```

Set up environment variables (`.env` file):

```env
MONGOURL=<your-mongodb-connection-string>
NODE_ENV=production
```

## Running the Application

### Development

```bash
npm run start
```

### Watch Mode

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

## Docker Setup

Ensure Docker and Docker Compose are installed.

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

The application will run on: `http://localhost:3000`

MongoDB will run on: `mongodb://localhost:27017`

## API Endpoints

### Doctor Management

#### Create Doctor

```http
POST /doctors
```

```json
{
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Slot Management

#### Create Slots

```http
POST /doctors/:doctorId/slots
```

```json
{
  "start_time": "2025-03-12T09:00:00Z",
  "end_time": "2025-03-20T12:00:00Z",
  "recurrence": "daily",                  // 'daily' | 'weekly' | 'monthly'
  "repeat_until": "2025-03-16T12:00:00Z"  // Optional
}
```

#### List Available Slots

```http
GET /doctors/:doctorId/slots?date=2025-03-15
```

### Booking Management

#### Book Slot

```http
POST /slots/:slotId/book
```

```json
{
  "patient_name": "Jane Smith"
}
```

#### Get Booked Slots

```http
GET /doctors/:doctorId/bookings?start_date=2025-03-15&end_date=2025-03-20
```

#### Get Available Slots

```http
GET /doctors/:doctorId/available_slots?date=2025-03-25
```

## Testing

Execute tests:

```bash
npm run test
```

## License

Distributed under the [MIT License](LICENSE).

