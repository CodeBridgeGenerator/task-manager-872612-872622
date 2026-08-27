
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(""),
description: faker.lorem.sentence(""),
startDate: faker.date.recent(""),
endDate: faker.date.recent(""),
status: faker.lorem.sentence(""),
visibility: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
