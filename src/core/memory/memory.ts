/**
 * ZX-M8XXX - Memory Management
 * @version 0.6.5
 * @license GPL-3.0
 *
 * Supports 48K, 128K, +2A, and Pentagon memory banking.
 * +2A adds port 0x1FFD with special all-RAM paging and 4 ROM banks.
 * Pentagon includes Beta Disk interface with separate TR-DOS ROM.
 */

'use strict';

import { getMachineProfile } from '../../machines/profiles';
import {
    PAGE_SIZE, BANK_MASK, P7FFD_RAM_MASK, P7FFD_SCREEN_BIT,
    P7FFD_ROM_BIT, P7FFD_LOCK_BIT, P7FFD_P1024_EXT,
    DECODE_128K_MASK, DECODE_PLUS2A_MASK2, DECODE_1FFD_PLUS2A,
    PORT_1FFD
} from '../constants';

const VERSION = '0.6.5';

export class Memory {
    static get VERSION() { return VERSION; }

    machineType: string;
    profile: any;
    rom: Uint8Array[] | null;
    ram: Uint8Array[] | null;
    trdosRom: Uint8Array | null;
    trdosActive: boolean;
    pagingDisabled: boolean;
    currentRomBank: number;
    currentRamBank: number;
    screenBank: number;
    contentionEnabled: boolean;
    allowRomEdit: boolean;
    port1FFD: number;
    specialPagingMode: boolean;
    specialBanks: number[];
    portEFF7: number;
    pentagon1024Mode: boolean;
    ramInRomMode: boolean;
    scorpionPort1FFD: number;
    scorpionRamInRomMode: boolean;
    onRead: ((addr: number, val: number) => void) | null;
    onWrite: ((addr: number, val: number) => void) | null;

    constructor(machineType = '48k') {
        this.machineType = machineType;
        this.profile = getMachineProfile(machineType);
        this.rom = null;
        this.ram = null;
        this.trdosRom = null;
        this.trdosActive = false;
        this.pagingDisabled = false;
        this.currentRomBank = 0;
        this.currentRamBank = 0;
        this.screenBank = 5;
        this.contentionEnabled = false;
        this.allowRomEdit = false;
        this.port1FFD = 0;
        this.specialPagingMode = false;
        this.specialBanks = [0, 1, 2, 3];
        this.portEFF7 = 0;
        this.pentagon1024Mode = false;
        this.ramInRomMode = false;
        this.scorpionPort1FFD = 0;
        this.scorpionRamInRomMode = false;
        this.onRead = null;
        this.onWrite = null;
        this.init();
    }

    init() {
        const p = this.profile;
        this.rom = [];
        for (let i = 0; i < p.romBanks; i++) {
            this.rom.push(new Uint8Array(PAGE_SIZE));
        }
        if (p.ramPages === 1) {
            this.ram = [new Uint8Array(3 * PAGE_SIZE)];
        } else {
            this.ram = [];
            for (let i = 0; i < p.ramPages; i++) {
                this.ram.push(new Uint8Array(PAGE_SIZE));
            }
        }
        this.trdosRom = new Uint8Array(PAGE_SIZE);
        this.reset();
    }

    reset() {
        if (this.profile.ramPages === 1) {
            this.ram![0].fill(0);
        } else {
            for (let bank of this.ram!) {
                bank.fill(0);
            }
        }
        this.pagingDisabled = false;
        this.currentRomBank = 0;
        this.currentRamBank = 0;
        this.screenBank = 5;
        this.trdosActive = false;
        this.port1FFD = 0;
        this.specialPagingMode = false;
        this.specialBanks = [0, 1, 2, 3];
        this.portEFF7 = 0;
        this.pentagon1024Mode = false;
        this.ramInRomMode = false;
        this.scorpionPort1FFD = 0;
        this.scorpionRamInRomMode = false;
    }

    loadRom(data, bank = 0) {
        if (bank < this.rom!.length) {
            const src = new Uint8Array(data);
            this.rom![bank].set(src.subarray(0, Math.min(src.length, PAGE_SIZE)));
        }
    }

    loadTrdosRom(data) {
        if (this.trdosRom) {
            const src = new Uint8Array(data);
            this.trdosRom.set(src.subarray(0, Math.min(src.length, PAGE_SIZE)));
        }
    }

    hasTrdosRom() {
        if (this.profile.trdosInRom) {
            const bank = this.rom![this.profile.trdosRomBank];
            if (!bank) return false;
            for (let i = 0; i < 256; i++) {
                if (bank[i] !== 0) return true;
            }
            return false;
        }
        if (!this.trdosRom) return false;
        for (let i = 0; i < 256; i++) {
            if (this.trdosRom[i] !== 0) return true;
        }
        return false;
    }

    read(addr) {
        let val;
        if (this.machineType === '48k') {
            if (addr < 0x4000) {
                val = (this.trdosActive && this.trdosRom) ? this.trdosRom[addr] : this.rom![0][addr];
            } else {
                val = this.ram![0][addr - 0x4000];
            }
        } else if (this.specialPagingMode) {
            const slot = addr >> 14;
            val = this.ram![this.specialBanks[slot]][addr & BANK_MASK];
        } else {
            if (addr < 0x4000) {
                if (this.trdosActive) {
                    val = this.profile.trdosInRom
                        ? this.rom![this.profile.trdosRomBank][addr]
                        : this.trdosRom![addr];
                } else if (this.ramInRomMode || this.scorpionRamInRomMode) {
                    val = this.ram![0][addr];
                } else {
                    val = this.rom![this.currentRomBank][addr];
                }
            }
            else if (addr < 0x8000) val = this.ram![5][addr - 0x4000];
            else if (addr < 0xC000) val = this.ram![2][addr - 0x8000];
            else val = this.ram![this.currentRamBank][addr - 0xC000];
        }
        if (this.onRead) this.onRead(addr, val);
        return val;
    }

    write(addr, val) {
        if (this.onWrite) this.onWrite(addr, val);
        if (this.specialPagingMode) {
            const slot = addr >> 14;
            this.ram![this.specialBanks[slot]][addr & BANK_MASK] = val;
            return;
        }
        if (addr < 0x4000) {
            if (this.ramInRomMode || this.scorpionRamInRomMode) {
                this.ram![0][addr] = val;
            }
            return;
        }
        if (this.machineType === '48k') {
            this.ram![0][addr - 0x4000] = val;
            return;
        }
        if (addr < 0x8000) this.ram![5][addr - 0x4000] = val;
        else if (addr < 0xC000) this.ram![2][addr - 0x8000] = val;
        else this.ram![this.currentRamBank][addr - 0xC000] = val;
    }
    
    writeDebug(addr, val) {
        addr &= 0xffff;
        val &= 0xff;
        if (addr < 0x4000) {
            if (!this.allowRomEdit) return false;
            if (this.profile.ramPages === 1) {
                this.rom![0][addr] = val;
            } else {
                this.rom![this.currentRomBank][addr] = val;
            }
            return true;
        }
        this.write(addr, val);
        return true;
    }
    
    writePaging(val) {
        if (this.profile.pagingModel === 'none' || this.pagingDisabled) return;
        if (this.profile.pagingModel === 'scorpion') {
            let page = val & P7FFD_RAM_MASK;
            page |= (this.scorpionPort1FFD & 0x10) >> 1;
            this.currentRamBank = page % this.profile.ramPages;
            this.screenBank = (val & P7FFD_SCREEN_BIT) ? 7 : 5;
            if (this.scorpionPort1FFD & 0x02) {
                this.currentRomBank = 2;
            } else {
                this.currentRomBank = (val & P7FFD_ROM_BIT) ? 1 : 0;
            }
            if (val & P7FFD_LOCK_BIT) this.pagingDisabled = true;
            return;
        }
        if (this.profile.pagingModel === 'pentagon1024') {
            let page = val & P7FFD_RAM_MASK;
            page |= (val & P7FFD_P1024_EXT) >> 3;
            if (this.pentagon1024Mode) {
                page |= (val & P7FFD_LOCK_BIT);
            }
            this.currentRamBank = page % this.profile.ramPages;
            this.screenBank = (val & P7FFD_SCREEN_BIT) ? 7 : 5;
            this.currentRomBank = (val & P7FFD_ROM_BIT) ? 1 : 0;
            if (!this.pentagon1024Mode && (val & P7FFD_LOCK_BIT)) {
                this.pagingDisabled = true;
            }
            return;
        }
        this.currentRamBank = val & P7FFD_RAM_MASK;
        this.screenBank = (val & P7FFD_SCREEN_BIT) ? 7 : 5;
        if (this.profile.pagingModel === '+2a') {
            this.currentRomBank = ((this.port1FFD >> 2) & 1) << 1 | ((val >> 4) & 1);
        } else {
            this.currentRomBank = (val & P7FFD_ROM_BIT) ? 1 : 0;
        }
        if (val & P7FFD_LOCK_BIT) this.pagingDisabled = true;
    }
    
    getPagingState() {
        const state: any = {
            ramBank: this.currentRamBank,
            romBank: this.currentRomBank,
            screenBank: this.screenBank,
            pagingDisabled: this.pagingDisabled
        };
        if (this.profile.pagingModel === '+2a') {
            state.port1FFD = this.port1FFD;
            state.specialPagingMode = this.specialPagingMode;
            state.specialBanks = this.specialBanks.slice();
        }
        if (this.profile.pagingModel === 'pentagon1024') {
            state.portEFF7 = this.portEFF7;
            state.pentagon1024Mode = this.pentagon1024Mode;
            state.ramInRomMode = this.ramInRomMode;
        }
        if (this.profile.pagingModel === 'scorpion') {
            state.scorpionPort1FFD = this.scorpionPort1FFD;
            state.scorpionRamInRomMode = this.scorpionRamInRomMode;
        }
        return state;
    }

    setPagingState(state) {
        this.currentRamBank = state.ramBank || 0;
        this.currentRomBank = state.romBank || 0;
        this.screenBank = state.screenBank || 5;
        this.pagingDisabled = state.pagingDisabled || false;
        if (this.profile.pagingModel === '+2a') {
            this.port1FFD = state.port1FFD || 0;
            this.specialPagingMode = state.specialPagingMode || false;
            this.specialBanks = state.specialBanks ? state.specialBanks.slice() : [0, 1, 2, 3];
        }
        if (this.profile.pagingModel === 'pentagon1024') {
            this.portEFF7 = state.portEFF7 || 0;
            this.pentagon1024Mode = state.pentagon1024Mode || false;
            this.ramInRomMode = state.ramInRomMode || false;
        }
        if (this.profile.pagingModel === 'scorpion') {
            this.scorpionPort1FFD = state.scorpionPort1FFD || 0;
            this.scorpionRamInRomMode = state.scorpionRamInRomMode || false;
        }
    }

    writePortEFF7(val) {
        this.portEFF7 = val;
        this.pentagon1024Mode = !(val & 0x04);
        this.ramInRomMode = !!(val & 0x08);
    }

    writeScorpion1FFD(val) {
        if (this.pagingDisabled) return;
        this.scorpionPort1FFD = val;
        this.scorpionRamInRomMode = !!(val & 0x01);
        if (val & 0x02) {
            this.currentRomBank = 2;
        } else {
            this.currentRomBank = this.currentRomBank & 1;
        }
        this.currentRamBank = (((val & 0x10) >> 1) | (this.currentRamBank & P7FFD_RAM_MASK)) % this.profile.ramPages;
    }

    write1FFD(val) {
        if (this.profile.pagingModel !== '+2a' || this.pagingDisabled) return;
        this.port1FFD = val;
        if (val & 0x01) {
            this.specialPagingMode = true;
            const config = (val >> 1) & 0x03;
            switch (config) {
                case 0: this.specialBanks = [0, 1, 2, 3]; break;
                case 1: this.specialBanks = [4, 5, 6, 7]; break;
                case 2: this.specialBanks = [4, 5, 6, 3]; break;
                case 3: this.specialBanks = [4, 7, 6, 3]; break;
            }
        } else {
            this.specialPagingMode = false;
            this.currentRomBank = ((val >> 2) & 1) << 1 | (this.currentRomBank & 1);
        }
    }

    setRamBank(bank) {
        if (this.profile.pagingModel === 'none') return;
        this.currentRamBank = bank % this.profile.ramPages;
    }

    setRomBank(bank) {
        if (this.profile.pagingModel === 'none') return;
        this.currentRomBank = bank % this.profile.romBanks;
    }

    setScreenBank(bank) {
        if (this.profile.pagingModel === 'none') return;
        this.screenBank = (bank === 5 || bank === 7) ? bank : 5;
    }

    setPagingDisabled(disabled) {
        if (this.profile.pagingModel === 'none') return;
        this.pagingDisabled = !!disabled;
    }

    writePort(port, val) {
        if ((port & DECODE_128K_MASK) === 0) {
            this.writePaging(val);
        }
        if (this.profile.pagingModel === '+2a' && (port & DECODE_PLUS2A_MASK2) === DECODE_1FFD_PLUS2A) {
            this.write1FFD(val);
        }
        if (this.profile.pagingModel === 'scorpion' && port === PORT_1FFD) {
            this.writeScorpion1FFD(val);
        }
    }
    
    readPort(port) {
        return 0xFF;
    }
    
    getScreenBase() {
        if (this.profile.ramPages === 1) return { ram: this.ram![0], offset: 0 };
        return { ram: this.ram![this.screenBank], offset: 0 };
    }

    getRamBank(bank) {
        if (this.profile.ramPages === 1) return this.ram![0];
        if (bank >= 0 && bank < this.ram!.length) return this.ram![bank];
        return null;
    }
    
    isContended(addr) {
        if (!this.contentionEnabled) return false;
        if (!this.profile.hasContention) return false;
        if (this.profile.ramPages === 1) return addr >= 0x4000 && addr < 0x8000;
        if (this.profile.pagingModel === '+2a') {
            if (this.specialPagingMode) {
                const slot = addr >> 14;
                return this.specialBanks[slot] >= 4;
            }
            if (addr >= 0x4000 && addr < 0x8000) return true;
            if (addr >= 0xC000) return this.currentRamBank >= 4;
            return false;
        }
        if (addr >= 0x4000 && addr < 0x8000) return true;
        if (addr >= 0xC000) return (this.currentRamBank & 1) === 1;
        return false;
    }
    
    setBlock(startAddr, data) {
        for (let i = 0; i < data.length; i++) {
            this.write(startAddr + i, data[i]);
        }
    }
    
    getBlock(startAddr, length) {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = this.read(startAddr + i);
        }
        return result;
    }

    getFullSnapshot() {
        const snapshot = new Uint8Array(0x10000);
        for (let addr = 0; addr < 0x10000; addr++) {
            snapshot[addr] = this.read(addr);
        }
        return snapshot;
    }

    getFullState() {
        const state: any = {
            machineType: this.machineType,
            currentRomBank: this.currentRomBank,
            currentRamBank: this.currentRamBank,
            screenBank: this.screenBank,
            pagingDisabled: this.pagingDisabled,
            trdosActive: this.trdosActive,
            port1FFD: this.port1FFD,
            specialPagingMode: this.specialPagingMode,
            specialBanks: this.specialBanks.slice()
        };
        if (this.profile.pagingModel === 'pentagon1024') {
            state.portEFF7 = this.portEFF7;
            state.pentagon1024Mode = this.pentagon1024Mode;
            state.ramInRomMode = this.ramInRomMode;
        }
        if (this.profile.pagingModel === 'scorpion') {
            state.scorpionPort1FFD = this.scorpionPort1FFD;
            state.scorpionRamInRomMode = this.scorpionRamInRomMode;
        }
        state.rom = this.rom!.map(bank => new Uint8Array(bank));
        state.ram = this.ram!.map(bank => new Uint8Array(bank));
        if (this.trdosRom) {
            state.trdosRom = new Uint8Array(this.trdosRom);
        }
        return state;
    }
}
