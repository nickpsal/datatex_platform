import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    hasThemeCookie(): string | null {
        const match = document.cookie.match(/darkMode=([^;]+)/);
        return match ? match[1] : null;
    }

    setCookie(name: string, value: string, days: number): void {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
    }

    getCookie(name: string): string | null {
        const cookies = document.cookie.split(';').map(c => c.trim());
        const found = cookies.find(c => c.startsWith(`${name}=`));
        return found ? found.split('=')[1] : null;
    }
}   