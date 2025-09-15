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
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = mockUsers.find(u => u.auth0Id === params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const userIndex = mockUsers.findIndex(u => u.auth0Id === params.id);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };

    return NextResponse.json(mockUsers[userIndex]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIndex = mockUsers.findIndex(u => u.auth0Id === params.id);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove user from array
    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    return NextResponse.json({ 
      success: true, 
      message: `User ${deletedUser.firstName} ${deletedUser.lastName} deleted successfully` 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
