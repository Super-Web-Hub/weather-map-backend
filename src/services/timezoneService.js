class TimezoneService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    async getTimeZoneData() {
        const { data, error } = await this.supabase
            .from('timezones')
            .select('*');

        if (error) {
            throw new Error('Error fetching time zone data: ' + error.message);
        }

        return data;
    }
}

export default TimezoneService;