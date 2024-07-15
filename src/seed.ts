import { Repository } from 'typeorm';
import Tours from './Entites/Tours';
import DummyTours from './tours-simple';
import AppdataSource from './database';
import Dates from './Entites/Date';
import { TourDate, TourWithDates } from './RequestInterface';

const seedDummyData = async () => {
  try {
    await AppdataSource.initialize();
    const toursRepo: Repository<Tours> = AppdataSource.getRepository(Tours);
    const DatesRepo: Repository<Dates> = AppdataSource.getRepository(Dates);
    // for (const data of DummyTours) {
    //   const newTour = toursRepo.create(data.tour);
    //   const newDates = data.dates.map((el) => {
    //     const newDate = new Dates();
    //     newDate.startDate = el.startDate;
    //     newDate.tour = newTour;
    //     return newDate;
    //   });
    //   await toursRepo.save(newTour);
    //   await DatesRepo.save(newDates);
    // }
    DummyTours.forEach(async (data: TourWithDates): Promise<void> => {
      const newTour: Tours = toursRepo.create(data.tour);
      const newDates: Dates[] = data.dates.map((el: TourDate) => {
        const newDate: Dates = new Dates();
        newDate.startDate = el.startDate;
        newDate.tour = newTour;
        return newDate;
      });
      await toursRepo.save(newTour);
      await DatesRepo.save(newDates);
    });
    console.log('Dummy data inserted successfully!');
  } catch (error) {
    console.log('error', error);
  } finally {
    process.exit();
  }
};

const deleteDummyData = async (): Promise<never> => {
  try {
    await AppdataSource.initialize();
    await AppdataSource.createQueryBuilder().delete().from(Tours).execute();
    console.log('Dummy data deleted successfully!');
  } catch (error) {
    console.log('error', error);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  seedDummyData();
} else if (process.argv[2] === '--delete') {
  deleteDummyData();
}

// await AppdataSource.createQueryBuilder().insert().into(Tours).values(DummyTours).execute();
// await AppdataSource.createQueryBuilder().insert().into(Dates).values(DummyDates).execute();
