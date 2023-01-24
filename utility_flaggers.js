(async function() {
    let aboutAction

    const id = "utility_flaggers"
    const name = "Utility Flaggers"
    const icon = "lightbulb"
    const author = "SirJain"
    
    // Used in about dialog
    const links = {
        twitter: "https://twitter.com/SirJain2",
        discord: "https://discord.gg/wM4CKTbFVN"
    }
    
    Plugin.register(id, {
        title: name,
        icon,
        author,
        description: "Flashes cubes based on template conditions.",
        about: "To do",
        tags: ["Flagger", "Utility"],
        version: "1.0.0",
        min_version: "4.2.0",
        variant: "both",
        oninstall: () => showAbout(true),

        onload() {
            addAbout()
        },

        onunload() {
            aboutAction.delete()
            MenuBar.removeAction(`help.about_plugins.about_${id}`)
        }
    })

    // Add the about dialog
    function addAbout() {
        let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
        if (!about) {
            about = new Action("about_plugins", {
                name: "About Plugins...",
                icon: "info",
                children: []
            })
            MenuBar.addAction(about, "help")
        }
        aboutAction = new Action(`about_${id}`, {
            name: `About ${name}...`,
            icon,
            click: () => showAbout()
        })
        about.children.push(aboutAction)
    }

    function showAbout(banner) {
        const infoBox = new Dialog({
            id: "about",
            title: name,
            width: 780,
            buttons: [],
            lines: [`
                <style>
                    dialog#about .dialog_title {
                        padding-left: 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    dialog#about .dialog_content {
                        text-align: left!important;
                        margin: 0!important;
                    }

                    dialog#about .socials {
                        padding: 0!important;
                    }

                    dialog#about #banner {
                        background-color: var(--color-accent);
                        color: var(--color-accent_text);
                        width: 100%;
                        padding: 0 8px
                    }

                    dialog#about #content {
                        margin: 24px;
                    }
                </style>
                ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
                <div id="content">
                    <h1 style="margin-top:-10px">${name}</h1>
                    <p>placeholder</p>
                    <div class="socials">
                    <a href="${links["twitter"]}" class="open-in-browser">
                        <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                        <label>Author's Twitter</label>
                    </a>
                    <a href="${links["discord"]}" class="open-in-browser">
                        <i class="fa-brands fa-discord" style="color:#5865F2"></i>
                        <label>Discord Server</label>
                    </a>
                    </div>
                </div>
            `]
        }).show()
        $("dialog#about .dialog_title").html(`
            <i class="icon material-icons">${icon}</i>
            ${name}
        `)
    }
})()