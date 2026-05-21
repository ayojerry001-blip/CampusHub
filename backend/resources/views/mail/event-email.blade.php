<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            width: 150px;
        }
        .event-details {
            margin-top: 20px;
        }
        .event-details h2 {
            color: #333;
        }
        .event-details p {
            margin: 5px 0;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Company Logo -->
        <div class="logo">
            <img src="{{ asset('logo.png') }}" alt="Company Logo">
        </div>

        <!-- Event Greeting -->
        <h1>Hello {{ $name }},</h1>
        <p>We are excited to inform you that you have been added to the following event:</p>

        <!-- Event Details -->
        <div class="event-details">
            <h2>{{ $title }}</h2>
            <p><strong>Location:</strong> {{ $location }}</p>
            <p><strong>Description:</strong> {{ $description }}</p>
            <p><strong>Start Date:</strong> {{ $startdate }}</p>
            <p><strong>End Date:</strong> {{ $enddate }}</p>
        </div>

        <p>Click the link to see all events {{$url}}</p>

        <!-- Thank You Note -->
        <p>If you have any questions or need more information, feel free to reach out to us.</p>

        <!-- Footer -->
        <div class="footer">
            <p>Thank you for being a part of our event!</p>
        </div>
    </div>

</body>
</html>
