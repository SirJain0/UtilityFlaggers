// 2x-1

(async function() {
    let aboutAction, cubes, material, duration

    // Highlighter mechanism
    const highlighter = {
        i: 1,
        running: false,
        start: (cubes, material, duration, durationPerFlash) => {
            if (highlighter.running) return
            highlighter.running = true
            Blockbench.showQuickMessage("Flagging...", 1500)

            for (const cube of cubes) {
                cube.mesh.material_non_flash = cube.mesh.material
            };

            clearInterval(highlighter.interval)
            highlighter.i = 1
            highlighter.interval = setInterval(() => highlighter.flash(cubes, material, duration), durationPerFlash)
            highlighter.flash(cubes, material, duration)
        },

        flash: (cubes, material, duration) => {
            let fc = highlighter.i

            if (fc > duration) {
                highlighter.running = false
                clearInterval(highlighter.interval)
            };

            for (const cube of cubes) {
                if (cube.mesh) {
                    cube.mesh.material = (fc % 2) ? material : cube.mesh.material_non_flash
                }
            };

            highlighter.i++
        }
    }

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
        twitterDerf: "https://twitter.com/Derf31922027",
        discord: "https://discord.gg/wM4CKTbFVN"
    }
    
    Plugin.register(id, {
        title: name,
        icon,
        author,
        description: "Flashes elements based on template conditions.",
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
                divider: "_",
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                },
                duration: {
                    type: "number",
                    min: "0.1",
                    value: "1.5",
                    step: "0.1",
                    label: "Duration Per Flag",
                }
            },

            onConfirm(formData) {
                cubes = Cube.all.filter(cube => 
                    (cube.size(0) > 0 && cube.size(0) < 1) || 
                    (cube.size(1) > 0 && cube.size(1) < 1) || 
                    (cube.size(2) > 0 && cube.size(2) < 1)
                )

                let hexString = formData.color.toHexString()
                parsedStr = parseInt(hexString.substring(1), 16)
                material = new THREE.MeshBasicMaterial({color: parsedStr})

                let numInput = formData.amount
                duration = 2 * numInput - 1

                let durationInput = formData.duration
                durationPerFlash = durationInput * 1000

                highlighter.start(cubes, material, duration, durationPerFlash)
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
                divider: "_",
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                },
                duration: {
                    type: "number",
                    min: "0.1",
                    value: "1.5",
                    step: "0.1",
                    label: "Duration Per Flag",
                }
            },

            onConfirm(formData) {
                cubes = Cube.all.filter(cube => (
                    cube.size(0) % 1 !== 0 || 
                    cube.size(1) % 1 !== 0 || 
                    cube.size(2) % 1 !== 0
                ))

                let hexString = formData.color.toHexString()
                parsedStr = parseInt(hexString.substring(1), 16)
                material = new THREE.MeshBasicMaterial({color: parsedStr})

                let numInput = formData.amount
                duration = 2 * numInput - 1

                let durationInput = formData.duration
                durationPerFlash = durationInput * 1000

                highlighter.start(cubes, material, duration, durationPerFlash)
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
                divider: "_",
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                },
                duration: {
                    type: "number",
                    min: "0.1",
                    value: "1.5",
                    step: "0.1",
                    label: "Duration Per Flag",
                }
            },

            onConfirm(formData) {
                cubes = Mesh.all

                let hexString = formData.color.toHexString()
                parsedStr = parseInt(hexString.substring(1), 16)
                material = new THREE.MeshBasicMaterial({color: parsedStr})

                let numInput = formData.amount
                duration = 2 * numInput - 1

                let durationInput = formData.duration
                durationPerFlash = durationInput * 1000

                highlighter.start(cubes, material, duration, durationPerFlash)
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
                divider: "_",
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                },
                duration: {
                    type: "number",
                    min: "0.1",
                    value: "1.5",
                    step: "0.1",
                    label: "Duration Per Flag",
                }
            },

            onConfirm(formData) {
                cubes = Mesh.all.filter(e => Object.entries(e.faces).length === 6)

                let hexString = formData.color.toHexString()
                parsedStr = parseInt(hexString.substring(1), 16)
                material = new THREE.MeshBasicMaterial({color: parsedStr})

                let numInput = formData.amount
                duration = 2 * numInput - 1

                let durationInput = formData.duration
                durationPerFlash = durationInput * 1000

                highlighter.start(cubes, material, duration, durationPerFlash)
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
                divider: "_",
                amount: {
                    type: "number",
                    min: "1",
                    value: "3",
                    label: "Flag Amount",
                },
                duration: {
                    type: "number",
                    min: "0.1",
                    value: "1.5",
                    step: "0.1",
                    label: "Duration Per Flag",
                }
            },

            onConfirm(formData) {
                cubes = Cube.all.filter(cube => 
                    (cube.size(0) < 0) || 
                    (cube.size(1) < 0) || 
                    (cube.size(2) < 0)
                )

                let hexString = formData.color.toHexString()
                parsedStr = parseInt(hexString.substring(1), 16)
                material = new THREE.MeshBasicMaterial({color: parsedStr})

                let numInput = formData.amount
                duration = 2 * numInput - 1

                let durationInput = formData.duration
                durationPerFlash = durationInput * 1000

                highlighter.start(cubes, material, duration, durationPerFlash)
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
                    <p>Flashes elements based on template conditions.</p>
					<h4>Worth noting:</h4>
					<p>- This plugin basically combines the original <b>BoxUV Cube Flagger</b> and <b>Mesh Flagger</b> plugins into one, with adding the functionality of flagging inverted (negative-sized) cubes as well.
                    <p>- DerfX is mentioned as an author due to his original contributions to the Mesh Flagger plugin.</p>
					<h4>How to use:</h4>
					<p>To use this plugin, go to <b>Tools > Utility Flaggers</b>. Choose your template for flagging (hover over question mark to learn more about it). Configure your settings if you wish, and then press <b>Flag</b>!</p>
					<br>
                    <div class="socials">
                        <a href="${links["twitter"]}" class="open-in-browser">
                            <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                            <label>SirJain's Twitter</label>
                        </a>
                        <a href="${links["twitterDerf"]}" class="open-in-browser">
                            <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                            <label>DerfX's Twitter</label>
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