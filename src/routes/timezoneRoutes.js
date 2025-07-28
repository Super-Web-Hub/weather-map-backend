const setTimezoneRoutes = (app) => {
    const TimezoneController = require('../controllers/timezoneController');
    const timezoneController = new TimezoneController();

    app.get('/api/timezones', timezoneController.getTimeZoneData.bind(timezoneController));
}

module.exports = setTimezoneRoutes;