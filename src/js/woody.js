
let options = {
        progress            : (val) => {
            actionBtn.progress.css({width: val+'%'});
        },
        onNextChanging      : () => { return true },
        afterNext           : () => {},
        progressValue       : 0,
};

let actionBtn = {
    next        : null,
    prev        : null,
    submit      : null,
    reset       : null,
    cancel      : null,
    progress    : null,

    //
    current     : null,
    nextTab     : null,
    prevTab     : null
};

let containersDiv = {
    nav         : null,
    tabs        : null,
    pans        : null
};


function loadOptions(opts) {
    let prop;

    for (prop in opts){
        options[prop] = opts[prop];
    }

}


/**
 * Repère les conteneurs util pour la manipulation de
 * de woody
 *
 * @param wizard
 */
function getContainers(wizard) {
   containersDiv.nav = wizard.find('.step-body').find('.step-nav');

   try {
       containersDiv.tabs = containersDiv.nav.find('.step-tab');
   }catch (e) {
       console.log('ERREUR : Veuillez verifier si la bar de navigation est a la bonne position et si elle a la bonne classe "step-nav"');
   }

}

const Woody = {

    /**
     * Initialisation of the wizard
     *
     * @param selector
     * @param options
     */
    init: (selector, options = null) => {

        loadOptions(options);

        let wizard = $(selector);
        wizard.addClass('w-hide');
        getContainers(wizard);

        initActions(wizard);
        putProgress(wizard);
        initNavigation(wizard);


        wizard.removeClass('w-hide');
    },


};

/**
 * Ajoute la bar de progression
 * @param wizard
 */
function putProgress(wizard) {
      wizard.find('.step-body').find('.step-container').prepend(createProgress());
      options.progress(0);
}

/**
 *
 * @param wizard
 */
function initActions(wizard) {

    //Prev button creation
    actionBtn.prev = createElement('button', 'Precedent', 'w-btn w-prev');

    //Next button
    actionBtn.next = createElement('button', 'Suivant', 'w-btn w-next');

    actionBtn.submit = createElement('button', 'Envoyer ...', 'w-btn w-submit w-hide');

    //Step footer pane
    let footer = createElement('div', '', 'step-footer');

    footer.append(actionBtn.prev);
    footer.append(actionBtn.next);
    footer.append(actionBtn.submit);

    wizard.find('.step-body').find('.step-container').append(footer);
    $('.step-pane').addClass('w-hide');

    actionBtn.next.click((e) => {

        if (options.onNextChanging !== null){
            let block = $(actionBtn.current.attr('href'));

            if (!options.onNextChanging(block)) return;

        }

        actionBtn.nextTab.trigger('click');

        options.afterNext(options.progress);

    });

    actionBtn.prev.click((e) => {
        actionBtn.prevTab.trigger('click');
    });

}

function initNavigation(wizard) {
    let nav = wizard.find('.step-nav');
    let first = nav.children().first();
    first.addClass('active');
    $(first.attr('href')).removeClass('w-hide');


    let tabs = nav.find('.step-tab');

    tabs.click(function (e) {
        e.preventDefault();
        let clicked = $(this);

        hidePanes(wizard);
        $(clicked.attr('href')).removeClass('w-hide');
        wizard.find('.step-nav .active').removeClass('active');
        clicked.addClass('active');


        actionBtn.current = clicked;
        actionBtn.nextTab = clicked.next();
        actionBtn.prevTab = clicked.prev();

        adaptActions();

    });

    actionBtn.current = first;
    actionBtn.nextTab = first.next();
    actionBtn.prevTab = {length: 0};
    
    adaptActions();

}

function adaptActions() {
    if (actionBtn.prevTab.length === 0){
        actionBtn.prev.addClass('w-hide');
    }else {
        actionBtn.prev.removeClass('w-hide');
    }

    if (actionBtn.nextTab.length === 0){

        actionBtn.next.addClass('w-hide');
        actionBtn.submit.removeClass('w-hide');

    }else {

        actionBtn.next.removeClass('w-hide');
        actionBtn.submit.addClass('w-hide');

    }

}

//Utils functions

function createElement(tag, html = '', classes = "", id = '') {
    let element = $(document.createElement(tag));

    //Adding classes
    element.addClass(classes);

    element.attr('id', id);
    element.html(html);

    return element;
}

function hidePanes(wizard) {
    wizard.find('.step-pane').addClass('w-hide');
}

function createProgress()
{
    actionBtn.progress = $('<div class="progress-bar progress-bar-striped progress-bar-animated green" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>');

    return $(' <div class="progress" style="height: 10px;"></div> ').html(actionBtn.progress);
}
