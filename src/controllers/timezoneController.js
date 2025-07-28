class TimezoneController {
    constructor(timezoneService) {
        this.timezoneService = timezoneService;
    }

    async getTimeZoneData(req, res) {
        try {
            const timeZoneData = await this.timezoneService.fetchTimeZoneData();
            res.status(200).json(timeZoneData);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching time zone data.' });
        }
    }
}

module.exports = TimezoneController;