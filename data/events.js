const TimelineOfDayData = (() => {
    // Define icons
    const preparationsIcon = new TimelineOfDayModels.Icon('preparations.png');
    const photosIcon = new TimelineOfDayModels.Icon('photos.png');
    const cityHallIcon = new TimelineOfDayModels.Icon('city-hall.png');
    const churchIcon = new TimelineOfDayModels.Icon('church.png');
    const dinerIcon = new TimelineOfDayModels.Icon('diner.png');
    const danceIcon = new TimelineOfDayModels.Icon('dance.png');
    const travelIcon = new TimelineOfDayModels.Icon('travel.png');

    // Define places
    const preparationsPlace = new TimelineOfDayModels.Place("Montrouge");
    const photosPlace = new TimelineOfDayModels.Place("Parc de Sceaux");
    const cityHallPlace = new TimelineOfDayModels.Place("City hall of paris");
    const churchPlace = new TimelineOfDayModels.Place("Notre-Dame de Paris");
    const dinerPlace = new TimelineOfDayModels.Place("Champs Elysées");

    // Define event styles & color
    const brideColor = new TimelineOfDayModels.Color('rgb(255, 201, 201)');
    const groomColor = new TimelineOfDayModels.Color('rgb(165, 216, 255)');
    const privateColor = new TimelineOfDayModels.Color('rgb(178, 242, 187)');
    const allColor = new TimelineOfDayModels.Color('rgb(255, 255, 255)');
    const brideEventStyle = new TimelineOfDayModels.EventStyle(brideColor);
    const groomEventStyle = new TimelineOfDayModels.EventStyle(groomColor);
    const privateEventStyle = new TimelineOfDayModels.EventStyle(privateColor);
    const allEventStyle = new TimelineOfDayModels.EventStyle(allColor);

    // Define events
    const preparationsBrideEvent = new TimelineOfDayModels.Event(
        preparationsIcon,
        "Préparatifs - Mariée",
        "Préparatifs de la marié, coiffeuse, maquillage, habillage accompagnée de sa mère et de ses sœurs.",
        preparationsPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(8, 0),
            new TimelineOfDayModels.Moment(10, 30)
        ),
        brideEventStyle
    );
    const preparationsGroomEvent = new TimelineOfDayModels.Event(
        preparationsIcon,
        "Préparatifs - Marié",
        "Préparatifs du marié, accompagné de ses amis",
        preparationsPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(9, 30),
            new TimelineOfDayModels.Moment(10, 30)
        ),
        groomEventStyle
    );
    const travelToPhotoEvent = new TimelineOfDayModels.Event(
        travelIcon,
        "Déplacement vers le parc de Sceaux",
        "",
        new TimelineOfDayModels.Travel(preparationsPlace, photosPlace),
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(10, 30),
            new TimelineOfDayModels.Moment(11, 0)
        ),
        privateEventStyle
    );

    const photosEvent = new TimelineOfDayModels.Event(
        photosIcon,
        "Photos des mariés",
        "Photos des mariés en commité réduit",
        photosPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(11, 0),
            new TimelineOfDayModels.Moment(12, 0)
        ),
        privateEventStyle
    );

    const photosAllEvent = new TimelineOfDayModels.Event(
        photosIcon,
        "Photos avec les invités",
        `
        Les groupes pour les photos :
        <ol>
            <li>Les mariés et leurs parents</li>
            <li>Les mariés et leurs frères et sœurs</li>
            <li>Les mariés et leurs amis</li>
            <li>Les mariés et leurs témoins</li>
            <li>Les mariés et leurs grands-parents</li>
        </ol>
        `,
        photosPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(12, 0),
            new TimelineOfDayModels.Moment(13, 0)
        ),
        allEventStyle
    );

    const travelToHallCityEvent = new TimelineOfDayModels.Event(
        travelIcon,
        "Déplacement vers la mairie",
        "Les mariés prennent la voiture blanche, les autres le mini bus loué.",
        new TimelineOfDayModels.Travel(photosPlace, cityHallPlace),
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(13, 0),
            new TimelineOfDayModels.Moment(14, 0)
        ),
        privateEventStyle
    );

    const cityHallEvent = new TimelineOfDayModels.Event(
        cityHallIcon,
        "Cérémonie civile",
        `
        Arrivée des invités à 14h00.<br>
        Début de la cérémonie à 14h15.<br>
        La cérémonie dure environ 30 minutes.<br>
        Les invités sortent et récupèrent des pétales à lancer.<br>
        Les mariés sortent à 15h00 et sont accueillis par les invités.<br>
        `,
        cityHallPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(14, 0),
            new TimelineOfDayModels.Moment(15, 0)
        ),
        allEventStyle
    );

    const travelToChurchEvent = new TimelineOfDayModels.Event(
        travelIcon,
        "Déplacement vers l'église",
        `Les mariés prennent la voiture blanche, les autres le mini bus loué.<br>
        Les invités sont encouragés à faire une colonne et à claxonner pour féliciter les mariés.`,
        new TimelineOfDayModels.Travel(cityHallPlace, churchPlace),
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(15, 0),
            new TimelineOfDayModels.Moment(16, 0)
        ),
        allEventStyle
    );

    const churchEvent = new TimelineOfDayModels.Event(
        churchIcon,
        "Cérémonie religieuse",
        "La cérémonie religieuse commence à 16h00 et dure environ 1 heure. Le marié arrive au bras de sa mère, la mariée au bras de son père.",
        churchPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(16, 0),
            new TimelineOfDayModels.Moment(17, 0)
        ),
        allEventStyle
    );

    const travelToDinerEvent = new TimelineOfDayModels.Event(
        travelIcon,
        "Déplacement vers la salle de réception",
        `Les mariés prennent la voiture blanche, les autres le mini bus loué. Arrivé sur place, les mariés se changent pour se préparer à recevoir les invités.<br>
        Les invités sont libres pour s'y rendre tant qu'ils y sont pour 18h30.`,
        new TimelineOfDayModels.Travel(churchPlace, dinerPlace),
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(17, 5),
            new TimelineOfDayModels.Moment(17, 35)
        ),
        allEventStyle
    );

    const dinerEvent = new TimelineOfDayModels.Event(
        dinerIcon,
        "Repas",
        `Vin d'honneur puis repas. Le menu : des trucs bons !<br>
        Quelques animations sont prévues pendant le repas.<br>
        <strong>Présentation du gâteau à 23h00</strong>`,
        dinerPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(18, 30),
            new TimelineOfDayModels.Moment(23, 10)
        ),
        allEventStyle
    );
    const danceEvent = new TimelineOfDayModels.Event(
        danceIcon,
        "Danse",
        "Moments de danse avec les mariés et les invités entre les différents moment du repas et après.",
        dinerPlace,
        new TimelineOfDayModels.Period(
            new TimelineOfDayModels.Moment(22, 40),
            new TimelineOfDayModels.Moment(2, 20)
        ),
        allEventStyle
    );

    // Define lines
    const line1 = TimelineOfDayModels.EventLine.createNewLine();
    const line2 = TimelineOfDayModels.EventLine.createNewLine();
    const line3 = TimelineOfDayModels.EventLine.createNewLine();
    const lines = [line1, line2, line3];

    line1
        .addEvent(preparationsBrideEvent)
        .addEvent(photosEvent)
        .addEvent(photosAllEvent)
        .addEvent(dinerEvent)
    ;
    line2
        .addEvent(preparationsGroomEvent)
        .addEvent(cityHallEvent)
        .addEvent(churchEvent)
        .addEvent(danceEvent)
    ;
    line3
        .addEvent(travelToPhotoEvent)
        .addEvent(travelToHallCityEvent)
        .addEvent(travelToChurchEvent)
        .addEvent(travelToDinerEvent)
    ;

    return {
        lines,
    };
})();
