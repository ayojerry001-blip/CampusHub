<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Headers;
use Symfony\Component\Mime\Header\UnstructuredHeader;
use Symfony\Component\Mime\Email;
use Mailtrap\EmailHeader\CategoryHeader;

class EventCancle extends Mailable
{
    use Queueable, SerializesModels;

    private string $name;
    private string $location;
    private string $title;
    private string $startdate;
    private string $enddate;
    private string $description;
    private string $sender_name;
    private string $code;
    private string $member_id;
    /**
     * Create a new message instance.
     */
    public function __construct(string $name, string $location, string $title, string $startdate, string $enddate, string $description,string $sender_name, string $code, string $member_id)
    {
        $this->name = $name;
        $this->location = $location;
        $this->title = $title;
        $this->startdate = $startdate;
        $this->enddate = $enddate;
        $this->description = $description;
        $this->sender_name = $sender_name;
        $this->code = $code;
        $this->member_id = $member_id;

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from : new Address(env('MAIL_FROM_ADDRESS'), $this->sender_name),
            replyTo: [
                new Address(env('MAIL_FROM_ADDRESS'), $this->sender_name),
            ],
            subject: 'Event Cancle',
            using: [
                function (Email $email){
                    $email->getHeaders()
                    ->addTextHeader('X-Message-Source', env('MAIL_DOMAIN_NAME'))
                    ->add(new UnstructuredHeader('X-Mailer', 'Mailtrap PHP Client'))
                ;

                // Category (should be only one)
                $email->getHeaders()
                    ->add(new CategoryHeader('Event Cancle'))
                ;
                }
            ]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.event-cancle',
            with: [
                'sender_name' => $this->sender_name,
                'name' => $this->name,
                'location' => $this->location,
                'title' => $this->title,
                'description' => $this->description,
                'startdate' => $this->startdate,
                'enddate' => $this->enddate,
                'url' => env("FRONTEND_URL")."/memberEvents/".$this->member_id."/".$this->code
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
    /**
     * Get the message headers.
     */
    public function headers(): Headers
    {
        return new Headers(
            env('MAIL_FROM_ADDRESS'),
            [env('MAIL_FROM_ADDRESS')],
            [
                'X-Custom-Header' => 'Custom Value',
            ],
        );
    }
}
