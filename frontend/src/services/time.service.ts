class TimeService {
    pad = (num: number) =>{
        return num < 10 ? '0' + num : num;
    }

    formatTime = (time: Date) => {
        const year = time.getFullYear();
        const month = this.pad(time.getMonth() + 1); // Months are 0-based
        const day = this.pad(time.getDate());
        const hours = this.pad(time.getHours());
        const minutes = this.pad(time.getMinutes());

        // Construct the formatted date string including the time zone offset up to minutes
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        return formattedDate;
    }
}

export default new TimeService();