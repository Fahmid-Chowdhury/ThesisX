import DB from "./DB/db.js";

async function testfunc() {
    const faculty = await DB.faculty.findUnique({
        where: { userId: 5 } // Correct object syntax
    });
    const thesis = await DB.thesis.findMany({
        where: {
            supervisorId: faculty.id
        }
    })

    console.log(faculty);
    console.log(thesis);
}

testfunc();