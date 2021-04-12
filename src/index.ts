import fs from 'fs';
import got from 'got';
import jsdom from 'jsdom';
import xlxs from 'xlsx';
const { JSDOM } = jsdom;


const page_url: string = 'https://downloads.khinsider.com';
const vgmUrl: string = 'https://downloads.khinsider.com/game-soundtracks/album/mega-man-11';

const is_a_song = (link: any) => {
    return !link.id.includes('songlist_header') && !link.id.includes('songlist_footer');
};

(async () => {
    try {
        const response = await got(vgmUrl);
        const dom = new JSDOM(response.body);
        const song_list = dom.window.document.querySelector('#songlist');
        let songs: HTMLTableRowElement[] = [...song_list.querySelectorAll('tr')]
        // GET HEADER OF THE LIST TO GET NAME AND DURATION INFO
        const header: HTMLTableRowElement = songs[0];
        const index_information = [...header.querySelectorAll('th')].findIndex((element, index: number) =>{
            return element.textContent.includes('Song Name');
        });
        songs =songs.filter(is_a_song);
        songs.forEach(async (song: HTMLTableRowElement, index: number) => {
            // every element have 7 childs
            // we need only the [2] for name and [3] for duration of the song
            // all of them have the link for the download
            const information_song= song.querySelectorAll('td');
            // get the link of the song
            const response_song = await got(page_url + information_song[index_information].querySelector('a').getAttribute('href'));
            const dom_song = new JSDOM(response_song.body);
            const player = dom_song.window.document.querySelector('#audio');
            const link = player.getAttribute('src');
            console.log(index, '-', information_song[index_information].querySelector('a').textContent, '-', information_song[index_information+1].querySelector('a').textContent);
            console.log(link);
        });
    } catch (err) {
        console.log(err);
    }
})();