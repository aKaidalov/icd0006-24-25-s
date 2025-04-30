import { ref, computed } from 'vue';

class Helpers {
    private timerInterval: number | undefined = undefined;
    private seconds = ref(0);

    formattedTime = computed(() => {
        const min = Math.floor(this.seconds.value / 60).toString().padStart(2, '0');
        const sec = (this.seconds.value % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    });

    startTimer() {
        if (this.timerInterval !== undefined) return;
        this.seconds.value = 0;
        this.timerInterval = setInterval(() => {
            this.seconds.value++;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval !== undefined) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
    }

    resetTimer() {
        this.stopTimer();
        this.seconds.value = 0;
    }

    getFormattedTime() {
        return this.formattedTime;
    }
}

export const helpers = new Helpers();
