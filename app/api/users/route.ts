import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/serverSession";

// Mock user data - replace with your actual database operations
const mockUsers = [
  {
    auth0Id: "auth0|123456789",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    subscriptionStatus: "active",
    subscriptionType: "monthly",
    stripeCustomerId: "cus_123456789",
    subscriptionId: "sub_123456789",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    foodPreference: "vegetarian",
    birthDate: "1990-01-01",
    streetAddress: "123 Main St"
  },
  {
    auth0Id: "auth0|987654321",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1987654321",
    subscriptionStatus: "inactive",
    subscriptionType: "weekly",
    stripeCustomerId: "cus_987654321",
    subscriptionId: "sub_987654321",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90210",
    country: "USA",
    foodPreference: "vegan",
    birthDate: "1985-05-15",
    streetAddress: "456 Oak Ave"
  },
  {
    auth0Id: "auth0|555666777",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phoneNumber: "+1555666777",
    subscriptionStatus: "expired",
    subscriptionType: "daily",
    stripeCustomerId: "cus_555666777",
    subscriptionId: "sub_555666777",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "USA",
    foodPreference: "gluten-free",
    birthDate: "1988-12-10",
    streetAddress: "789 Pine St"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Generate a new auth0Id for the new user
    const newAuth0Id = `auth0|${Date.now()}`;
    const newUser = {
      auth0Id: newAuth0Id,
      ...body,
      subscriptionStatus: body.subscriptionStatus || "active",
      subscriptionType: body.subscriptionType || "monthly"
    };

    mockUsers.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
