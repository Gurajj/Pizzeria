/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  
  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

      console.log('this product', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordion(){
      const thisProduct = this;
      
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        event.preventDefault;
        const activeProduct = document.querySelector('.product.active');
        console.log('activeProduct to: ', activeProduct);
        if(activeProduct != null && activeProduct != thisProduct.element){
          activeProduct.classList.remove('active');
        }
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      });
    }

    initOrderForm(){
      const thisProduct = this;
      console.log('initOrderForm:');
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder(){
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
    
      let price = thisProduct.data.price;
    
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        console.log('paramId', paramId, param);
        
        for(let optionId in param.options) {
          const option = param.options[optionId];
          console.log(optionId, option);
          const selector = '.' + paramId + '-' + optionId; 
          console.log('selector', selector);

          if(thisProduct.imageWrapper.querySelector(selector) != null){
            thisProduct.imageWrapper.querySelector(selector).classList.remove(classNames.menuProduct.imageVisible);
            if(formData[paramId].includes(optionId)){
              thisProduct.imageWrapper.querySelector(selector).classList.add(classNames.menuProduct.imageVisible);
            }
          }
          
          if(formData[paramId] && formData[paramId].includes(optionId)){
            if(!option.hasOwnProperty('default')) {
              price = price + option.price;
            }
          } else {
            if(option.hasOwnProperty('default')){
              price = price - option.price;
            }
          }
        }
      }
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data ', thisApp.data);
    
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this; 
      thisApp.data = dataSource; 
    },
    
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
