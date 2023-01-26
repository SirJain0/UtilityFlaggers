(async function() {
    let aboutAction

    // About dialog variables
    const id = "utility_flaggers"
    const name = "Utility Flaggers"
    const icon = "lightbulb"
    const author = "SirJain and DerfX"

    // Dialog variables
    let invertedDialog, smallCubeDialog, sixFacedMeshDialog, allMeshDialog, decimalCubeDialog

    // Action variables
    let boxuvConditions, meshConditions
    let invertedCubeCondition, smallCubeCondition, decimalCubeCondition
    let sixMeshCondition, allMeshCondition
    let flaggersParent
    
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
            registerDialogs()
            registerActions()
            MenuBar.addAction(flaggersParent, "tools")
        },

        onunload() {
            aboutAction.delete()
            MenuBar.removeAction(`help.about_plugins.about_${id}`)
            MenuBar.removeAction("tools.flaggers_action")

            Blockbench.showQuickMessage("Uninstalled Utility Flaggers", 2000)
        }
    })

    // Initializes all plugin actions
    function registerActions() {

        // Child conditions of sub-parent
        smallCubeCondition = new Action("small_cube_condition", {
            name: "Flag Small Cubes",
            icon: "fa-cube",
            click: () => smallCubeDialog.show()
        })

        decimalCubeCondition = new Action("decimal_cube_condition", {
            name: "Flag Decimal-Sized Cubes",
            icon: "fa-cube",
            click: () => decimalCubeDialog.show()
        })

        allMeshCondition = new Action("all_mesh_condition", {
            name: "Flag Meshes",
            icon: "diamond",
            click: () => allMeshDialog.show()
        })

        sixMeshCondition = new Action("six_mesh_condition", {
            name: "Flag 6-Faced Meshes",
            icon: "diamond",
            click: () => sixFacedMeshDialog.show()
        })

        // Other condition
        invertedCubeCondition = new Action("inverted_cube_conditions", {
            name: "Flag Inverted Cubes",
            icon: "invert_colors",
            click: () => invertedDialog.show()
        })

        // Sub-parent actions
        boxuvConditions = new Action("boxuv_conditions", {
            name: "Invalid BoxUV Cubes",
            icon: "fa-cube",
            children: ["small_cube_condition", "decimal_cube_condition"]
        })

        meshConditions = new Action("mesh_conditions", {
            name: "Mesh Flaggers",
            icon: "diamond",
            children: ["all_mesh_condition", "six_mesh_condition"]
        })

        // Main Parent Action
        flaggersParent = new Action("flaggers_action", {
            name: "Utility Flaggers",
            icon: icon,
            children: [
                "boxuv_conditions", 
                "mesh_conditions",
                "inverted_cube_conditions"
            ]
        })
    }

    // Register the dialogs - dialogs are triggered by clicking an action using .show()
    function registerDialogs() {
        smallCubeDialog = new Dialog("small_cube_dialog", {
            title: "Flag Small Cubes",
            buttons: ["Flag", "Cancel"],

            form: {
                color: {
                    type: "color",
                    label: "Color",
                    value: "#FF3131"
                },
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                }
            },

            onConfirm() {
                console.log("Small cube dialog clicked!")
            }
        })

        decimalCubeDialog = new Dialog("decimal_cube_dialog", {
            title: "Flag Decimal-Sized Cubes",
            buttons: ["Flag", "Cancel"],

            form: {
                color: {
                    type: "color",
                    label: "Color",
                    value: "#FF8C31"
                },
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                }
            },

            onConfirm() {
                console.log("Decimal cube dialog clicked!")
            }
        })

        allMeshDialog = new Dialog("all_mesh_dialog", {
            title: "Flag Meshes",
            buttons: ["Flag", "Cancel"],

            form: {
                color: {
                    type: "color",
                    label: "Color",
                    value: "#F1F1F1"
                },
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                }
            },

            onConfirm() {
                console.log("All-mesh dialog clicked!")
            }
        })

        sixFacedMeshDialog = new Dialog("six_faced_mesh_dialog", {
            title: "Flag 6-Faced Meshes",
            buttons: ["Flag", "Cancel"],

            form: {
                color: {
                    type: "color",
                    label: "Color",
                    value: "#F1F1F1"
                },
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                }
            },

            onConfirm() {
                console.log("6-faced mesh dialog clicked!")
            }
        })

        invertedDialog = new Dialog("inverted_cube_dialog", {
            title: "Flag Inverted Cubes",
            buttons: ["Flag", "Cancel"],

            form: {
                color: {
                    type: "color",
                    label: "Color",
                    value: "#F1F1F1"
                },
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                }
            },

            onConfirm() {
                console.log("Inverted cube dialog clicked!")
            }
        })
    }

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