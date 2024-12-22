import  { PrismaClient } from"@prisma/client";
const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log("Seeding database...");

        // Create sample users
        const users = await prisma.user.createMany({
            data: [
                {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    password: "securepassword", // Remember to hash in a real app
                    role: "FACULTY",
                    department: "Computer Science",
                    bio: "Experienced AI researcher",
                    verified: true,
                },
                {
                    name: "Jane Smith",
                    email: "janesmith@example.com",
                    password: "securepassword", // Remember to hash in a real app
                    role: "STUDENT",
                    department: "Biotechnology",
                    bio: "Aspiring researcher in genomics",
                    verified: false,
                },
            ],
        });

        console.log("Users created:", users);

        // Create sample faculty details
        const faculty = await prisma.faculty.create({
            data: {
                userId: 2, // ID of the faculty user
                researchInterests: ["Artificial Intelligence", "Machine Learning"],
                availabe_slot: 3,
                publications: {
                    create: [
                        {
                            title: "AI in Healthcare",
                            abstract: "Exploring the applications of AI in healthcare systems.",
                            authors: ["John Doe", "Collaborator A"],
                            publicationDate: new Date("2022-08-15"),
                            url: "https://example.com/ai-in-healthcare",
                        },
                        {
                            title: "Ethics in AI",
                            abstract: "A comprehensive look at ethical AI systems.",
                            authors: ["John Doe"],
                            publicationDate: new Date("2021-03-10"),
                            url: "https://example.com/ethics-in-ai",
                        },
                    ],
                },
            },
        });

        console.log("Faculty created:", faculty);

        // Create sample student details
        const student = await prisma.student.create({
            data: {
                userId: 3, // ID of the student user
                researchInterests: ["Genomics", "Bioinformatics"],
                contributions: {
                    create: [
                        {
                            title: "Genome Sequencing Techniques",
                            abstract: "Advancements in sequencing technologies.",
                            authors: ["Jane Smith"],
                            publicationDate: new Date("2023-02-20"),
                            url: "https://example.com/genome-sequencing",
                        },
                        {
                            title: "Applications of CRISPR",
                            abstract: "Using CRISPR in medical research.",
                            authors: ["Jane Smith", "Collaborator B"],
                            publicationDate: new Date("2023-05-10"),
                            url: "https://example.com/crispr-applications",
                        },
                    ],
                },
            },
        });

        console.log("Student created:", student);

        console.log("Database seeding complete!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
