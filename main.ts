//% color=#00B1ED  icon="\uf018" block="Trackbit" blockId="Trackbit"
namespace Trackbit {

    let TrackBit_state_value: number = 0

    export enum TrackbitStateType {
        //% block="◌ ◌ ◌ ◌"
        Tracking_State_0 = 0,
        //% block="◌ ● ● ◌"
        Tracking_State_1 = 6,
        //% block="◌ ◌ ● ◌"
        Tracking_State_2 = 4,
        //% block="◌ ● ◌ ◌"
        Tracking_State_3 = 2,


        //% block="● ◌ ◌ ●"
        Tracking_State_4 = 9,
        //% block="● ● ● ●"
        Tracking_State_5 = 15,
        //% block="● ◌ ● ●"
        Tracking_State_6 = 13,
        //% block="● ● ◌ ●"
        Tracking_State_7 = 11,

        //% block="● ◌ ◌ ◌"
        Tracking_State_8 = 1,
        //% block="● ● ● ◌"
        Tracking_State_9 = 7,
        //% block="● ◌ ● ◌"
        Tracking_State_10 = 5,
        //% block="● ● ◌ ◌"
        Tracking_State_11 = 3,

        //% block="◌ ◌ ◌ ●"
        Tracking_State_12 = 8,
        //% block="◌ ● ● ●"
        Tracking_State_13 = 14,
        //% block="◌ ◌ ● ●"
        Tracking_State_14 = 12,
        //% block="◌ ● ◌ ●"
        Tracking_State_15 = 10
    }
    export enum TrackbitType {
        //% block="◌"
        State_0 = 0,
        //% block="●"
        State_1 = 1
    }
    export enum TrackbitChannel {
        //% block="1"
        One = 0,
        //% block="2"
        Two = 1,
        //% block="3"
        Three = 2,
        //% block="4"
        Four = 3
    }
    export enum TrackBit_gray {
        //% block="line"
        One = 0,
        //% block="background"
        Two = 4
    }

    /**
    * Get gray value.The range is from 0 to 255.
    */
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% block="Trackbit channel %channel gray value"
    export function TrackbitgetGray(channel: TrackbitChannel): number {
        pins.i2cWriteNumber(0x1a, channel, NumberFormat.Int8LE)
        return pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
    }

    //% State.fieldEditor="gridpicker"
    //% State.fieldOptions.columns=4
    //% block="Trackbit is %State"
    export function TrackbitState(State: TrackbitStateType): boolean {
        return TrackBit_state_value == State
    }
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% block="Trackbit channel %channel is %state"
    export function TrackbitChannelState(channel: TrackbitChannel, state: TrackbitType): boolean {
        let TempVal: number = 0
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TempVal = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        if (state == TrackbitType.State_1)
            if (TempVal & 1 << channel) {
                return true
            }
            else {
                return false
            }
        else {
            if (TempVal & 1 << channel) {
                return false
            }
            else {
                return true
            }
        }
    }

    //% deprecated=true
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% detect_target.fieldEditor="gridpicker" detect_target.fieldOptions.columns=2
    //% block="Trackbit Init_Sensor_Val channel %channel detection target %detect_target value"
    export function Trackbit_Init_Sensor_Val(channel: TrackbitChannel, detect_target: TrackBit_gray): number {
        let Init_Sensor_Val = pins.createBuffer(8)
        pins.i2cWriteNumber(0x1a, 5, NumberFormat.Int8LE)
        Init_Sensor_Val = pins.i2cReadBuffer(0x1a, 8)
        return Init_Sensor_Val[channel + detect_target]
    }

    //% deprecated=true
    //% val.min=0 val.max=255
    //% block="Set Trackbit learn fail value %val"
    export function Trackbit_learn_fail_value(val: number) {
        pins.i2cWriteNumber(0x1a, 6, NumberFormat.Int8LE)
        pins.i2cWriteNumber(0x1a, val, NumberFormat.Int8LE)
    }

    /**
    * Gets the position offset.The range is from -3000 to 3000.
    */
    //% sensor_number.fieldEditor="gridpicker" sensor_number.fieldOptions.columns=2
    //% block="Trackbit sensor offset value"
    export function TrackBit_get_offset(): number {
        let offset: number
        pins.i2cWriteNumber(0x1a, 5, NumberFormat.Int8LE)
        const offsetH = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        pins.i2cWriteNumber(0x1a, 6, NumberFormat.Int8LE)
        const offsetL = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        offset = (offsetH << 8) | offsetL
        offset = Math.map(offset, 0, 6000, -3000, 3000)
        return offset;
    }

    //% block="Get a Trackbit state value"
    export function Trackbit_get_state_value() {
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TrackBit_state_value = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        basic.pause(5);
    }
}
