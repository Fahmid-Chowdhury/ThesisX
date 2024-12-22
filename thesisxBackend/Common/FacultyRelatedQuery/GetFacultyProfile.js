import DB from "../../DB/db.js";

async function GetFacultyProfile(id) {
    const faculty = await DB.User.findUnique({
        where: { id: id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            bio: true,
            verified: true,
            createdAt: true,
            updatedAt: true,
            image: true,
            faculty: {
                select: {
                    researchInterests: true,
                    available_slot: true,
                    publications: {
                        select: {
                            id: true,
                            title: true,
                            authors: true,
                            url: true,
                            publicationDate: true,
                        },
                    },
                },
            }
        }
    })
    return faculty;
}

export default GetFacultyProfile;