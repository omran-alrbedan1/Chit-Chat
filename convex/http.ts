import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

// Validate the incoming payload from Clerk
const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
    const payload = await req.text();

    // Extract and validate svix headers
    const svixHeaders = {
        'svix-id': req.headers.get('svix-id')!,
        'svix-timestamp': req.headers.get('svix-timestamp')!,
        'svix-signature': req.headers.get('svix-signature')!,
    };

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    try {
        const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
        return event;
    } catch (error) {
        console.error('Webhook verification failed', error);
        return undefined;
    }
}

// Handle Clerk webhook events
const handleClerkWebhook = httpAction(async (ctx, req) => {
    try {
        const event = await validatePayload(req);

        if (!event) {
            console.error("Invalid Clerk payload");
            return new Response('Could not validate Clerk payload', { status: 400 });
        }

        switch (event.type) {
            case 'user.created':
                // Check if the user already exists in the Convex database
                const existingUser = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });

                if (!existingUser) {
                    console.log(`Creating new user ${event.data.id}`);
                    try {
                        await ctx.runMutation(internal.user.create, {
                            username: `${event.data.first_name} ${event.data.last_name}`,
                            imageUrl: event.data.image_url,
                            clerkId: event.data.id,
                            email: event.data.email_addresses[0]?.email_address, // Optional chaining
                        });
                        console.log(`User ${event.data.id} created successfully in Convex`);
                    } catch (error) {
                        console.error(`Failed to create user ${event.data.id} in Convex:`, error);
                    }
                } else {
                    console.log(`User ${event.data.id} already exists.`);
                }
                break;

            case 'user.updated':
                console.log(`Updating user ${event.data.id}`);
                try {
                    await ctx.runMutation(internal.user.create, {
                        username: `${event.data.first_name} ${event.data.last_name}`,
                        imageUrl: event.data.image_url,
                        clerkId: event.data.id,
                        email: event.data.email_addresses[0]?.email_address, // Optional chaining
                    });
                    console.log(`User ${event.data.id} updated successfully in Convex`);
                } catch (error) {
                    console.error(`Failed to update user ${event.data.id} in Convex:`, error);
                }
                break;

            default:
                console.log(`Clerk webhook event not supported: ${event.type}`);
                break;
        }

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Error handling Clerk webhook', error);
        return new Response('Internal server error', { status: 500 });
    }
});

const http = httpRouter();
http.route({
    path: '/clerk-users-webhook', 
    method: 'POST',
    handler: handleClerkWebhook,
});

export default http;
