<template>
  <div>
    <!-- <input type="text" :value="formatValue" /> -->
    <div class="pannel">
      <div class="pannel__nav">
        <span @click="preYear" class="pointer">&lt;&lt;</span>
        <span @click="preMonth" class="pointer">&lt;</span>
        <div>
          <span>{{ time.year }}年</span>
          <span>{{ time.month + 1 }}月</span>
        </div>
        <span class="pointer" @click="nextMonth">&gt;</span>
        <span class="pointer" @click="nextYear">&gt;&gt;</span>
      </div>
      <div class="day__sign">
        <div v-for="(day, index) in 7" :key="index">
          {{ weekDay[day] }}
        </div>
      </div>
      <main class="pannel__content grid__container">
        <div
          class="grid__cell"
          :class="[
            isCurrentMonth(date) ? 'currentMonth' : 'notCurrentMonth',
            isCurrentDay(date) ? 'currentDay' : 'notCurrentDay',
            +clock.startTime! === +date && 'selected',
            +clock.endTime! === +date && 'selected',
            inRange(date) && 'selected'
          ]"
          v-for="(date, index) in visibleDate"
          :key="date.getTime()"
          @click="selectTime(date)"
        >
          {{ date.getDate() }}
        </div>
      </main>
      <footer class="pannel__footer">
        <div class="footer__content">
          <div>开始时间</div>
          <div class="footer__input">
            <input type="number" class="square__input" :disabled="!clock.Editable" />
            :
            <input type="number" class="square__input" :disabled="!clock.Editable" />
          </div>
        </div>
        <div class="footer__content">
          <div>结束时间</div>
          <div class="footer__input">
            <input type="number" class="square__input" :disabled="!clock.Editable" />
            :
            <input type="number" class="square__input" :disabled="!clock.Editable" />
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
<script setup lang="ts">
import { getAllDates, getFullYearMonthAndDate } from '@/utils'
import { computed, reactive, ref } from 'vue'
const date = ref(new Date())
const clock = reactive<{
  startTime: Date | null
  Editable: boolean
  endTime: Date | null
}>({
  startTime: null,
  endTime: null,
  Editable: false
})

const time = reactive(getFullYearMonthAndDate(date.value))
const nextYear = () => {
  const date = new Date(time.year, time.month)
  date.setFullYear(date.getFullYear() + 1)
  time.year = date.getFullYear()
  time.month = date.getMonth()
}
const nextMonth = () => {
  const date = new Date(time.year, time.month)
  date.setMonth(date.getMonth() + 1)
  time.year = date.getFullYear()
  time.month = date.getMonth()
}
const preMonth = () => {
  const date = new Date(time.year, time.month)
  date.setMonth(date.getMonth() - 1)
  time.year = date.getFullYear()
  time.month = date.getMonth()
}
const preYear = () => {
  const date = new Date(time.year, time.month)
  date.setFullYear(date.getFullYear() - 1)
  time.year = date.getFullYear()
  time.month = date.getMonth()
}

enum weekDay {
  Su = 7,
  Mo = 1,
  Tu = 2,
  We = 3,
  Th = 4,
  Fr = 5,
  Sa = 6
}
const selectTime = (date: Date) => {
  if (clock.Editable) {
    clock.endTime = date
    clock.Editable = false
    return
  }
  clock.Editable = true

  clock.startTime = date
  clock.endTime = date
}
const isCurrentMonth = (data: Date) => {
  const currentYear = time.year
  const currentMonth = time.month

  const { year, month } = getFullYearMonthAndDate(data)

  return year === currentYear && currentMonth === month
}
const isCurrentDay = (data: Date) => {
  const {
    year: currentYear,
    month: currentMonth,
    date: currentDate
  } = getFullYearMonthAndDate(date.value)

  const { year, month, date: pDate } = getFullYearMonthAndDate(data)

  return year === currentYear && currentMonth === month && pDate === currentDate
}

const inRange = (date: Date) => {
  if (clock.endTime! < clock.startTime!) {
    ;[clock.endTime, clock.startTime] = [clock.startTime, clock.endTime]
  }

  return +clock.startTime! < +date && +clock.endTime! > +date
}
const visibleDate = computed(() => {
  const firstDayOfMonth = new Date(time.year, time.month, 1)
  let firstDayInCalendar = new Date(firstDayOfMonth)
  firstDayInCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

  let lastDayInCalendar = new Date(firstDayInCalendar)
  lastDayInCalendar.setDate(firstDayInCalendar.getDate() + 41)

  return getAllDates(firstDayInCalendar, lastDayInCalendar)
})
</script>

<style scoped>
span {
  padding: 8px;
}
.pannel {
  position: absolute;
  background: #fff;
  filter: drop-shadow(-0.13rem 0 0.6rem rgb(8, 0, 2));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;

  & .pannel__nav {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.grid__container {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(7, 1fr);
  /* gap: 5px; */
  width: 420px;
  height: 300px;
  place-items: center;
  .grid__cell {
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    &:hover {
      color: purple;
      border-style: solid;
      border-width: 2px;
      cursor: pointer;
    }
  }
}
.day__sign {
  display: flex;
  flex: 1;
  justify-content: space-around;
  margin-top: 20px;
}
.notCurrentMonth {
  color: gray;
}
.currentMonth {
  color: black;
  border-radius: 4px;
}
.currentDay {
  color: red;
}
.pannel__footer {
  color: black;
  & .footer__content {
    display: flex;
    justify-content: space-between;
    padding: 15px;
  }
}
.pointer {
  cursor: pointer;
}
.selected {
  color: purple;
  border-style: solid;
  border-width: 2px;
}
.square__input {
  width: 60px;
  height: 30px;
  padding: 10px;
  border: 2px solid #333;
  border-radius: 10px;
  text-align: center;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  &:focus {
    border-color: #0066cc;
    box-shadow: 0 0 10px rgba(0, 102, 204, 0.5);
  }
  .colon {
    font-weight: 600;
  }
}
</style>
