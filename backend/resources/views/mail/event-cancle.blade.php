<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Canceled</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 20px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <!-- Company Logo -->
        <tr>
            <td align="center" style="padding-bottom: 20px;">
                <img src="{{ asset('logo.png') }}" alt="Company Logo" style="width: 150px;">
            </td>
        </tr>

        <!-- Event Cancellation Notice -->
        <tr>
            <td>
                <h1 style="font-size: 24px; color: #d9534f;">Important Notice: Event Canceled</h1>
                <p style="font-size: 16px; color: #333;">Dear {{ $name }},</p>
                <p style="font-size: 16px; color: #333;">
                    We regret to inform you that the following event has been canceled:
                </p>

                <!-- Event Details -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                    <tr>
                        <td style="font-size: 16px; color: #333;">
                            <strong>Event Title:</strong> {{ $title }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #333;">
                            <strong>Location:</strong> {{ $location }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #333;">
                            <strong>Description:</strong> {{ $description }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; color: #333;">
                            <strong>Originally Scheduled:</strong> {{ $startdate }} to {{ $enddate }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Apology and Next Steps -->
        <tr>
            <td style="padding-top: 20px;">
                <p style="font-size: 16px; color: #333;">
                    We apologize for any inconvenience this may have caused. If you have any questions or need further assistance, please feel free to contact us.
                </p>
                <p style="font-size: 16px; color: #333;">
                    Thank you for your understanding.
                </p>
            </td>
        </tr>
        <p>Click the link to see all events {{$url}}</p>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding-top: 30px; font-size: 14px; color: #777;">
                <p>Best regards,</p>
                <p>{{$sender_name}}</p>
                <p><a href="https://eventryx.com" style="color: #337ab7;">www.eventryx.com</a></p>
            </td>
        </tr>
    </table>

</body>
</html>
